import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SoAndSoFace } from './SoAndSoFace'

test('renders 5 stroke groups', () => {
  const { container } = render(<SoAndSoFace wake={0} />)
  expect(container.querySelectorAll('[data-stroke]').length).toBe(5)
})

test('wake level inks proportional groups', () => {
  const { container } = render(<SoAndSoFace wake={2} />)
  const inked = Array.from(container.querySelectorAll('[data-stroke]')).filter(
    (g) => Number((g as SVGElement).style.opacity) >= 0.9,
  )
  expect(inked.length).toBe(2)
})
