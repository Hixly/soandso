import { expect, test } from 'vitest'
import { dedupeMemory } from './memory'

test('drops near-duplicate', () => {
  expect(dedupeMemory('User is training for a 5k', ['User is training for a 5K'])).toBe(false)
})

test('keeps novel fact', () => {
  expect(dedupeMemory('User lives in Denver', ['User is training for a 5k'])).toBe(true)
})
