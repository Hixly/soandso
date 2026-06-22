import { expect, test } from 'vitest'
import { surpriseName } from './names'

test('returns a known name', () => {
  expect(surpriseName(() => 0)).toBe('Sage')
})
