import { expect, test } from 'vitest'
import { tonePreview } from './prompt'

test('blunt+energy+brief sample', () => {
  expect(tonePreview({ gentle_blunt: 90, chill_energy: 90, brief_detailed: 10 })).toMatch(
    /Next idea|won't work|Go/i,
  )
})

test('gentle+chill+detailed sample', () => {
  expect(tonePreview({ gentle_blunt: 10, chill_energy: 10, brief_detailed: 90 })).toMatch(
    /no rush|gently|step by step/i,
  )
})
