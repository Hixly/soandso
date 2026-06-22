const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim()

export function dedupeMemory(candidate: string, existing: string[]): boolean {
  const c = norm(candidate)
  return !existing.some((e) => norm(e) === c)
}

export const RECENT_N = 12
