import "./BuildCostDisplay.css"
import round from '../data/round'

const resourceKey = {
  "water": "W",
  "volatiles": "V",
  "metals": "M",
  "nobleMetals": "N",
  "fissiles": "F",
  "antimatter": "A",
  "exotics": "E"
}

const BuildCostDisplay = (props) => {
  if (!props.data) return <p className="buildcost">-</p>
  let elements = []
  Object.entries(props.data).forEach(([resourceType, resourceQuantity]) => {
    if (!resourceQuantity) {
      return
    }
    if (elements.length > 0) elements.push(<span key={'div'+resourceType}>/</span>)
    elements.push(<span className={`resourceSpan ${resourceType}`} key={resourceType}>{round(resourceQuantity)}{resourceKey[resourceType]}</span>)
  })
  return (
    <p className="buildcost">{elements.length ? elements : '-'}</p>
  )
}

export default BuildCostDisplay

export const scaleBuildCost = (buildcost, scalar) => {
  let res = {...buildcost}
  for (const resourceType of Object.keys(resourceKey)) {
    res[resourceType] = typeof res[resourceType] === 'number' ? res[resourceType] * scalar : 0
  }
  return res
}

export const addBuildCost = (buildcostA, buildCostB) => {
  let res = {...buildcostA}
  for (const resourceType of Object.keys(resourceKey)) {
    if (!res[resourceType]) res[resourceType] = 0
    if (buildCostB[resourceType]) res[resourceType] += buildCostB[resourceType]
  }
  return res
}