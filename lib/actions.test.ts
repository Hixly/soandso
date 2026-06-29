import { expect, test } from 'vitest'
import { detectReminder, detectSave, extractUrl, wantsSummary } from './actions'

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

test('detects save command, label, and remainder', () => {
  expect(detectSave('save this')).toEqual({ label: 'Saved', remainder: '' })
  expect(detectSave('save this as a recipe')).toEqual({ label: 'Recipe', remainder: '' })
  expect(detectSave('save that to my ideas')).toEqual({ label: 'Ideas', remainder: '' })
  expect(detectSave('bookmark this')).toEqual({ label: 'Saved', remainder: '' })
  expect(detectSave('pin this as ideas')).toEqual({ label: 'Ideas', remainder: '' })
  // Trailing save after a real question → keeps the question as remainder.
  expect(detectSave('recommend a fun game? save this')).toEqual({
    label: 'Saved',
    remainder: 'recommend a fun game',
  })
  expect(detectSave('give me a pasta recipe, save it as a recipe')).toEqual({
    label: 'Recipe',
    remainder: 'give me a pasta recipe',
  })
  // Should NOT fire on incidental "save this X" mid-sentence.
  expect(detectSave('how do I save this file in excel')).toBeNull()
  expect(detectSave('what should I save for retirement')).toBeNull()
  expect(detectSave('just chatting')).toBeNull()
})
