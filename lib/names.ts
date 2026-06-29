// Curated, gender-neutral names — chosen to feel warm and personal without
// assuming the user wants a masculine or feminine companion.
export const NAMES = [
  'Sage',
  'Nova',
  'Juno',
  'Remy',
  'Kai',
  'Ari',
  'Wren',
  'River',
  'Sol',
  'Indigo',
  'Marlo',
  'Vesper',
]

// Pick a random name, optionally avoiding `exclude` so repeated taps always change.
export const surpriseName = (exclude?: string, rand: () => number = Math.random) => {
  const pool = exclude ? NAMES.filter((n) => n !== exclude) : NAMES
  const list = pool.length ? pool : NAMES
  return list[Math.floor(rand() * list.length)]
}
