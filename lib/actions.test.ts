import { expect, test } from 'vitest'
import { detectReminder, extractUrl, wantsSummary } from './actions'

test('detects reminder text', () => {
  expect(detectReminder('Remind me to stretch at 6pm')).toBe('stretch at 6pm')
  expect(detectReminder('hello there')).toBeNull()
})

test('extracts url', () => {
  expect(extractUrl('summarize https://example.com/post please')).toBe('https://example.com/post')
  expect(extractUrl('no link here')).toBeNull()
})

test('detects summary intent', () => {
  expect(wantsSummary('can you summarize this')).toBe(true)
  expect(wantsSummary('tldr please')).toBe(true)
  expect(wantsSummary('just chatting')).toBe(false)
})
