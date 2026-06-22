export function heuristicHard(message: string): boolean {
  return message.length > 140 || /\b(why|how|plan|compare|explain|step)\b/i.test(message)
}
