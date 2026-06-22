import { afterEach, beforeEach, expect, test } from 'vitest'
import { getModel } from './model'

let savedKey: string | undefined

beforeEach(() => {
  savedKey = process.env.GEMINI_API_KEY
  delete process.env.GEMINI_API_KEY
})

afterEach(() => {
  if (savedKey === undefined) delete process.env.GEMINI_API_KEY
  else process.env.GEMINI_API_KEY = savedKey
})

test('falls back to mock with no key', () => {
  const m = getModel()
  expect(m.backend).toBe('mock')
})

test('mock chat returns content + optional sources', async () => {
  const m = getModel()
  const r = await m.chat({ system: 'sys', memories: [], history: [], message: 'hi', escalate: false })
  expect(typeof r.content).toBe('string')
  expect(r.content.length).toBeGreaterThan(0)
})

test('mock chat fakes a citation when message asks for current info', async () => {
  const m = getModel()
  const r = await m.chat({
    system: 'sys',
    memories: [],
    history: [],
    message: 'latest news on mars',
    escalate: true,
  })
  expect(r.sources && r.sources.length).toBeTruthy()
})
