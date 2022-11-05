
export default function round(figure, factor = 100, scaleMicro = true) {
  if (figure === 0) return 0
  if (scaleMicro && figure < 0.001 && figure > -0.001) return round(figure * 1000000, factor, false) + 'μ'
  let existentialFactor = 1
  figure *= factor
  while (figure < factor && figure > -factor) {
    figure *= 10
    existentialFactor *= 10
  }

  return Math.round(figure) / (factor * existentialFactor)
}