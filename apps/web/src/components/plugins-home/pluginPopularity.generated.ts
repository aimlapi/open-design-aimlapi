// AUTO-GENERATED — DO NOT EDIT BY HAND.
//
// Blended template popularity, used to order the plugin/example grid and the
// Home rail so the templates users actually reach for lead each category and
// sub-category (OPEND-449). Higher score = more popular; range [0, 1].
//
// How it is built (deterministic, creds-free transform):
//   score = 0.6 * norm(log1p(distinctUsers)) + 0.4 * norm(log1p(runs))
//   • window: trailing 28 days of `run_finished` events (by plugin_id)
//   • distinct users are the anti-gaming signal; runs add engagement depth
//   • log1p tames the head-template scale gap; min-max normalized over the
//     live-catalog template set so both metrics land in [0, 1]
//   • RETIRED plugins (absent from the live catalog) are dropped
//   • templates with no renderable preview are EXCLUDED — mode-seed entries
//     (e.g. the generic Live Artifact / HyperFrames options) live in the
//     composer mode picker, not the gallery, so usage must not float them up
//   • templates below 20 distinct users are OMITTED so thin-sample
//     tail templates keep their curated/visual fallback order
//
// Regenerate with: pnpm exec tsx scripts/refresh-plugin-popularity.ts --write
// Refreshed weekly by .github/workflows/refresh-plugin-popularity.yml.
// See pluginPopularity.RUNBOOK.md here.

export interface PluginPopularityMeta {
  readonly generatedAt: string;
  readonly windowDays: number;
  readonly weights: { readonly users: number; readonly runs: number };
  readonly minUsers: number;
  readonly count: number;
}

export const PLUGIN_POPULARITY_META: PluginPopularityMeta = {
  generatedAt: '2026-08-24',
  windowDays: 28,
  weights: { users: 0.6, runs: 0.4 },
  minUsers: 20,
  count: 92,
};

// Plugin id -> blended popularity score in [0, 1], most-popular first.
export const PLUGIN_POPULARITY: Readonly<Record<string, number>> = {
  'example-web-prototype': 1.0,
  'example-simple-deck': 0.8822,
  'example-web-clone': 0.8447,
  'example-mobile-app': 0.713,
  'example-open-design-landing': 0.6845,
  'example-webgl-experience': 0.6508,
  'example-wireframe-mobile-flow': 0.6159,
  'example-gamified-app': 0.6145,
  'example-kanban-board': 0.5948,
  'example-fs-creative-voltage': 0.5803,
  'image-template-anime-martial-arts-battle-illustration': 0.5638,
  'example-wireframe-sketch': 0.5532,
  'example-digital-eguide': 0.5437,
  'example-guizang-ppt': 0.5431,
  'example-fs-notebook-tabs': 0.5362,
  'example-mobile-onboarding': 0.5322,
  'example-social-carousel': 0.5307,
  'example-fs-electric-studio': 0.5295,
  'example-webgl-caustic-pool': 0.5248,
  'example-dashboard': 0.5183,
  'video-template-video-seedance-three-kingdoms-lyubu-yuanmen-archery': 0.5012,
  'example-motion-frames': 0.4971,
  'example-resume-modern': 0.4947,
  'image-template-e-commerce-live-stream-ui-mockup': 0.4939,
  'example-video-hyperframes': 0.4873,
  'example-wireframe-greybox': 0.482,
  'video-template-seedance-2-0-15-second-cinematic-japanese-romance-short-film': 0.4793,
  'example-blog-post': 0.4725,
  'example-html-ppt-zhangzara-creative-mode': 0.4712,
  'image-template-profile-avatar-anime-girl-to-cinematic-photo': 0.4706,
  'example-social-media-matrix-tracker-template': 0.4627,
  'example-huashu-bento-insight': 0.4606,
  'example-velar-luxury-real-estate': 0.4564,
  'example-huashu-keynote-black': 0.4548,
  'image-template-profile-avatar-casual-fashion-grid-photoshoot': 0.4522,
  'example-codex-interactive-capability-map': 0.4476,
  'example-wireframe-annotated': 0.4431,
  'image-template-3d-stone-staircase-evolution-infographic': 0.439,
  'example-html-ppt-course-module': 0.4388,
  'video-template-frame-kinetic-type': 0.4368,
  'example-mockup-device-3d': 0.4361,
  'example-hps-academic-paper': 0.434,
  'example-html-ppt-knowledge-arch-blueprint': 0.4287,
  'example-fs-editorial-forest': 0.4262,
  'image-template-illustration-crayon-kid-drawing-rework': 0.4242,
  'example-html-ppt-zhangzara-capsule': 0.4238,
  'example-trading-analysis-dashboard-template': 0.4214,
  'example-image-poster': 0.4186,
  'example-huashu-slides': 0.4045,
  'video-template-luxury-supercar-cinematic-narrative': 0.4038,
  'example-webgl-aurora-veil': 0.4015,
  'example-html-ppt-hermes-cyber-terminal': 0.4003,
  'video-template-3d-animated-boy-building-lego': 0.3899,
  'example-audio-jingle': 0.3884,
  'example-doc-kami-parchment': 0.3882,
  'example-deck-swiss-international': 0.3879,
  'example-webgl-depth-gallery': 0.3852,
  'example-flowai-live-dashboard-template': 0.3843,
  'example-live-dashboard': 0.3834,
  'video-template-frame-logo-outro': 0.3795,
  'example-docs-page': 0.3781,
  'image-template-illustrated-city-food-map': 0.3774,
  'example-kami-deck': 0.3773,
  'example-webgl-distortion-grain': 0.3765,
  'example-pm-spec': 0.3745,
  'example-hps-true-blueprint': 0.3733,
  'example-github-dashboard': 0.3713,
  'example-critique': 0.3694,
  'image-template-momotaro-explainer-slide-in-hybrid-style': 0.3682,
  'example-html-ppt-zhangzara-block-frame': 0.3638,
  'image-template-notion-team-dashboard-live-artifact': 0.3622,
  'example-html-ppt-zhangzara-studio': 0.3617,
  'video-template-frame-bold-poster': 0.3594,
  'image-template-game-screenshot-anime-fighting-game-captain-ryuuga-vs-kaze-renshin': 0.3573,
  'example-open-design-landing-deck': 0.3561,
  'example-html-ppt-zhangzara-scatterbrain': 0.3524,
  'example-frame-flowchart-sticky': 0.3516,
  'video-template-frame-build-minimal': 0.3506,
  'example-huashu-golden-circle': 0.35,
  'example-hps-bauhaus': 0.3478,
  'example-ib-pitch-book': 0.338,
  'example-huashu-luxe-whitespace': 0.3369,
  'example-huashu-takram-soft-tech': 0.3367,
  'example-finance-report': 0.3324,
  'example-webgl-particle-galaxy': 0.3323,
  'example-frame-logo-outro': 0.3291,
  'video-template-frame-liquid-bg-hero': 0.3281,
  'image-template-game-ui-ancient-china-open-world-mmo-hud': 0.3248,
  'example-deck-open-slide-canvas': 0.3232,
  'example-email-marketing': 0.3196,
  'example-video-shortform': 0.3157,
  'video-template-a-decade-of-refinement-glow-up': 0.3011,
};

// Templates with no renderable preview — suppressed from the visual gallery
// grid so they never show as an empty letter card. They still reach users
// through the composer's mode picker. Repo-derived (baked manifest + on-disk
// `od.preview` entry existence), refreshed alongside the scores above.
export const PLUGIN_NO_PREVIEW: readonly string[] = [
  'example-dcf-valuation',
  'example-design-brief',
  'example-hatch-pet',
  'example-html-ppt',
  'example-hyperframes',
  'example-last30days',
  'example-live-artifact',
  'example-pptx-html-fidelity-audit',
  'example-x-research',
];
