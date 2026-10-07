export type Request = { revision: number; observation: { text: string; truncated: boolean }; candidates: { id: string; label: string }[]; contract: { choose_exactly_one: string[] } };
export type Route = { id: string; label: string; reason: string };
export function buildRequest(text: string, revision?: number): Request;
export function fixtureResponse(request: Request): { revision: number; candidate_id: string; reason: string };
export function acceptResponse(request: Request, response: { revision: number; candidate_id: string; reason?: string }): Route;
export function routedText(route: Route, text: string): string;
export const ROUTES: readonly { id: string; label: string; bias: number }[];
