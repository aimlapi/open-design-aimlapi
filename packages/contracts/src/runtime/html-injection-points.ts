/**
 * Locating a real structural boundary in an HTML document, by source offset.
 *
 * Both preview transports splice text into an artifact's own bytes: the daemon
 * injects URL-preview bridges into the file it serves, and `buildSrcdoc`
 * injects the srcDoc bridges. Neither re-serializes the document — the author's
 * bytes have to survive — so each needs the *offset* of a boundary rather than
 * a parsed tree.
 *
 * Finding that offset with a plain text match is what broke
 * nexu-io/open-design#7410. The tags these injectors look for are also
 * perfectly ordinary content: a prototype that builds an HTML document (a print
 * window, an email template, a `srcdoc` payload) writes `<body>` into a script
 * string or onto a `data-` attribute. Splicing there puts the injected
 * `</script>` inside the author's script, which ends it early and renders the
 * remainder as page text — or closes their attribute early, since injected
 * bridges carry quotes. Either way the page breaks with no console error.
 *
 * This module is the single source of truth for that lookup. It lives in
 * contracts because the bug's root cause was two copies of the same logic
 * drifting apart: the srcDoc path anchored on the real `</body>` while the
 * daemon copy still matched the first one in the text.
 *
 * Pure string scanning — no DOM, no parser dependency — so it behaves
 * identically in the daemon, in the browser, and under test.
 */

/**
 * Elements whose content the HTML parser reads as character data, not markup.
 * A tag written inside one of these is text the author chose to store, not a
 * structural boundary of this document.
 *
 * `noscript` is included because every preview surface runs with scripting
 * enabled, which is what puts it in the raw-text set. `plaintext` runs to end
 * of input; having no close tag, it correctly reports "no boundary left".
 */
export const HTML_RAW_TEXT_ELEMENTS = [
  'script',
  'style',
  'textarea',
  'title',
  'iframe',
  'noembed',
  'noframes',
  'noscript',
  'plaintext',
  'xmp',
] as const;

const RAW_TEXT: readonly string[] = HTML_RAW_TEXT_ELEMENTS;

/**
 * Offset of the `>` that closes the start/end tag beginning at `from`, or -1
 * when the tag never closes.
 *
 * Quoted attribute values are skipped, so a `>` the author wrote inside one
 * does not end the tag early. A quote only opens a value when it directly
 * follows `=`; anywhere else it is a literal character of an unquoted value.
 */
export function endOfTag(html: string, from: number): number {
  let i = from;
  let lastSignificant = 0;
  while (i < html.length) {
    const ch = html.charCodeAt(i);
    if ((ch === 34 /* " */ || ch === 39 /* ' */) && lastSignificant === 61 /* = */) {
      const close = html.indexOf(String.fromCharCode(ch), i + 1);
      if (close < 0) return -1;
      i = close + 1;
      lastSignificant = 0;
      continue;
    }
    if (ch === 62 /* > */) return i;
    if (ch > 32) lastSignificant = ch;
    i += 1;
  }
  return -1;
}

/**
 * Offset of the first `pattern` match that the HTML parser would actually treat
 * as a tag, or -1 when the document has none.
 *
 * `pattern` is matched stickily at each `<`, so pass it unanchored and let it
 * identify the tag name only — `endOfTag` gives the tag's extent. Give it a
 * tag-name boundary: a bare `/<head[^>]*>/` also matches `<header>`.
 *
 * The scan walks tag by tag rather than character by character, skipping every
 * place a tag-looking run of text is not this document's markup:
 *
 *   - comments and other markup declarations
 *   - raw-text element content (`HTML_RAW_TEXT_ELEMENTS`)
 *   - attribute values
 *   - `<template>` content, which the tree builder keeps out of the document,
 *     so an injection placed there would silently never run
 *
 * This is a tokenizer-level approximation, not a full HTML5 state machine. It
 * degrades safely: every case it cannot resolve returns -1, which callers treat
 * as "no boundary here" and fall back to appending or prepending.
 */
export function findRealTagOffset(html: string, pattern: RegExp): number {
  const anchored = new RegExp(pattern.source, `${pattern.flags.replace(/[gy]/g, '')}y`);
  const tagOpen = /<(\/?)([a-z][a-z0-9]*)/iy;
  const lower = html.toLowerCase();
  let i = 0;
  while (i < html.length) {
    if (html.charCodeAt(i) !== 60 /* < */) {
      i += 1;
      continue;
    }
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4);
      // An unterminated comment swallows the rest of the document, so there is
      // no real tag left to find.
      if (end < 0) return -1;
      i = end + 3;
      continue;
    }
    if (html.startsWith('<!', i) || html.startsWith('<?', i)) {
      // Doctype and bogus-comment states both end at the next `>`.
      const end = html.indexOf('>', i + 2);
      if (end < 0) return -1;
      i = end + 1;
      continue;
    }
    anchored.lastIndex = i;
    if (anchored.test(html)) return i;
    tagOpen.lastIndex = i;
    const open = tagOpen.exec(html);
    if (!open) {
      // A `<` that starts no tag is ordinary text (`a < b`).
      i += 1;
      continue;
    }
    const tagEnd = endOfTag(html, i + open[0].length);
    if (tagEnd < 0) return -1;
    const tagName = (open[2] ?? '').toLowerCase();
    if (!open[1] && RAW_TEXT.includes(tagName)) {
      const contentEnd = lower.indexOf(`</${tagName}`, tagEnd + 1);
      // Unclosed raw text runs to the end of the document — same as above.
      if (contentEnd < 0) return -1;
      i = contentEnd;
      continue;
    }
    if (!open[1] && tagName === 'template') {
      const boundary = /<(\/?)template(?=[\s/>])/gi;
      boundary.lastIndex = tagEnd + 1;
      let depth = 1;
      let next: RegExpExecArray | null;
      while (depth > 0 && (next = boundary.exec(html)) !== null) {
        depth += next[1] ? -1 : 1;
      }
      if (depth > 0) return -1;
      i = boundary.lastIndex;
      continue;
    }
    i = tagEnd + 1;
  }
  return -1;
}

/**
 * Offset just past the `>` of the first real `pattern` match — the insertion
 * point for content that belongs immediately inside that tag. -1 when the
 * document has no such tag.
 */
export function findRealTagEnd(html: string, pattern: RegExp): number {
  const start = findRealTagOffset(html, pattern);
  if (start < 0) return -1;
  const end = endOfTag(html, start);
  return end < 0 ? -1 : end + 1;
}

/** Tag-name-bounded patterns for the boundaries preview injection cares about. */
export const HTML_TAG_PATTERNS = {
  htmlOpen: /<html(?=[\s/>])/i,
  headOpen: /<head(?=[\s/>])/i,
  headClose: /<\/head(?=[\s>])/i,
  bodyOpen: /<body(?=[\s/>])/i,
  bodyClose: /<\/body(?=[\s>])/i,
  baseOpen: /<base(?=[\s/>])/i,
  titleOpen: /<title(?=[\s>])/i,
} as const;
