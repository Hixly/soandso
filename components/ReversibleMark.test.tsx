import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ReversibleMark } from './ReversibleMark'

test('two mirrored profiles', () => {
  const { container } = render(<ReversibleMark progress={1} />)
  expect(container.querySelectorAll('path').length).toBe(2)
})

test('blank at progress 0', () => {
  const { container } = render(<ReversibleMark progress={0} />)
  const paths = Array.from(container.querySelectorAll('path'))
  expect(paths.every((p) => Number((p as SVGPathElement).style.strokeDashoffset) === 1)).toBe(true)
})

test('fully drawn at progress 1', () => {
  const { container } = render(<ReversibleMark progress={1} />)
  const paths = Array.from(container.querySelectorAll('path'))
  expect(paths.every((p) => Number((p as SVGPathElement).style.strokeDashoffset) === 0)).toBe(true)
})
