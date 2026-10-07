const ROUTES = Object.freeze([
  { id: 'do_now', label: 'Do now', bias: 0.75 },
  { id: 'schedule', label: 'Schedule', bias: 0.6 },
  { id: 'archive', label: 'Archive', bias: 0.35 },
  { id: 'review', label: 'Review deeply', bias: 0.7 },
]);

export function buildRequest(text, revision = 1) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('Clipboard contains no text');
  const normalized = text.trim().slice(0, 2000);
  return {
    revision,
    observation: { text: normalized, truncated: text.trim().length > normalized.length },
    candidates: ROUTES.map(({ id, label }) => ({ id, label })),
    contract: { choose_exactly_one: ROUTES.map(({ id }) => id) },
  };
}

export function fixtureResponse(request) {
  const text = request.observation.text.toLowerCase();
  let candidateId = 'archive';
  if (/urgent|today|maintenant|asap/.test(text)) candidateId = 'do_now';
  else if (/meeting|rendez-vous|tomorrow|demain|\d{1,2}:\d{2}/.test(text)) candidateId = 'schedule';
  else if (text.length > 280 || /research|analyse|proposal|spec/.test(text)) candidateId = 'review';
  return { revision: request.revision, candidate_id: candidateId, reason: 'deterministic offline fixture' };
}

export function acceptResponse(request, response) {
  if (response.revision !== request.revision) throw new Error('Stale clipboard decision');
  const route = request.candidates.find((candidate) => candidate.id === response.candidate_id);
  if (!route) throw new Error('Decision escaped the finite route set');
  return { ...route, reason: String(response.reason || '') };
}

export function routedText(route, text) {
  return `[${route.label}] ${text.trim()}`;
}

export { ROUTES };
