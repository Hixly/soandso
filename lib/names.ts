const NAMES = ['Sage', 'Coach', 'Buddy', 'Nova', 'Echo', 'Pip', 'Juno', 'Remy']

export const surpriseName = (rand: () => number = Math.random) =>
  NAMES[Math.floor(rand() * NAMES.length)]
