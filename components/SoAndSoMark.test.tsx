import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SoAndSoMark } from './SoAndSoMark'

test('blank at progress 0 — every path fully hidden', () => {
  const { container } = render(<SoAndSoMark progress={0} />)
  const paths = Array.from(container.querySelectorAll('path'))
  expect(paths.length).toBeGreaterThan(0)
  expect(paths.every((p) => Number((p as SVGPathElement).style.strokeDashoffset) === 1)).toBe(true)
})

test('fully drawn at progress 1 — every path revealed', () => {
  const { container } = render(<SoAndSoMark progress={1} />)
  const paths = Array.from(container.querySelectorAll('path'))
  expect(paths.every((p) => Number((p as SVGPathElement).style.strokeDashoffset) === 0)).toBe(true)
})

test('renders optional name', () => {
  const { getByText } = render(<SoAndSoMark progress={1} name="Coach" />)
  expect(getByText('Coach')).toBeTruthy()
})
