import { expect, test } from 'vitest'
import { surpriseName, NAMES } from './names'

test('returns the first name with a zero rand', () => {
  expect(surpriseName(undefined, () => 0)).toBe(NAMES[0])
})

test('never returns the excluded name', () => {
  // With rand=0 the pool would normally yield NAMES[0]; excluding it shifts to the next.
  expect(surpriseName(NAMES[0], () => 0)).toBe(NAMES[1])
})
