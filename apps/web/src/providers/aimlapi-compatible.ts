/**
 * aimlapi.com chat completions provider. aimlapi.com is an OpenAI-wire-
 * compatible aggregator gateway (POST /v1/chat/completions, Bearer auth, SSE
 * delta frames + [DONE]), so the only thing that differs from
 * streamMessageOpenAI is the daemon proxy endpoint — keeping a dedicated client
 * makes the picker tab -> daemon log line -> upstream call chain readable end
 * to end and leaves room for aimlapi.com-specific divergence (the
 * X-AIMLAPI-Source / X-AIMLAPI-Partner-ID attribution pair, injected
 * daemon-side).
 *
 * Routes through the daemon proxy to avoid browser CORS issues and to keep the
 * attribution pair out of the browser bundle, where a user could strip or
 * forge it. BYOK — the key stays on the user's machine.
 */
import type { AppConfig, ChatMessage } from '../types';
import type { StreamHandlers } from './anthropic';
import { streamProxyEndpoint, type ProxyContext } from './api-proxy';

export async function streamMessageAimlapi(
  cfg: AppConfig,
  system: string,
  history: ChatMessage[],
  signal: AbortSignal,
  handlers: StreamHandlers,
  context?: ProxyContext,
): Promise<void> {
  return streamProxyEndpoint(
    '/api/proxy/aimlapi/stream',
    cfg,
    system,
    history,
    signal,
    handlers,
    context,
  );
}
