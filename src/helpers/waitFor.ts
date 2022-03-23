export const waitFor = async (waitFor: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      return resolve()
    }, waitFor)
  })
}
