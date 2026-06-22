import { expect, test } from 'vitest'
import { JOB_PRESETS, buildSystemPrompt } from './prompt'

test('preset maps to role string', () => {
  expect(JOB_PRESETS['Stay on my goals']).toMatch(/accountability/i)
})

test('blunt high-energy brief prompt', () => {
  const s = buildSystemPrompt('Coach', 'a gym coach', {
    gentle_blunt: 80,
    chill_energy: 80,
    brief_detailed: 20,
  })
  expect(s).toContain('You are Coach')
  expect(s).toContain('blunt')
  expect(s).toContain('high-energy')
  expect(s).toContain('short')
})

test('gentle chill detailed prompt', () => {
  const s = buildSystemPrompt('Sage', 'a guide', {
    gentle_blunt: 10,
    chill_energy: 10,
    brief_detailed: 90,
  })
  expect(s).toContain('gentle')
  expect(s).toContain('calm')
  expect(s).toContain('detailed')
})
