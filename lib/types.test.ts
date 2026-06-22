import { expect, test } from 'vitest'
import type { Personality } from './types'

test('personality shape', () => {
  const p: Personality = { gentle_blunt: 50, chill_energy: 50, brief_detailed: 50 }
  expect(Object.keys(p)).toHaveLength(3)
})
