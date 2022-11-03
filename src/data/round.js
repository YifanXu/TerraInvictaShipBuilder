
export default function round(figure, factor = 100) {
  if (figure === 0) return 0
  let existentialFactor = 1
  figure *= factor
  while (figure < factor && figure > -factor) {
    figure *= 10
    existentialFactor *= 10
  }

  return Math.round(figure) / (factor * existentialFactor)
}