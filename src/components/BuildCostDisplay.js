import "./BuildCostDisplay.css"
import round from '../data/round'

import waterIcon from '../data/images/ICO_water.png'
import volatileIcon from '../data/images/ICO_volatiles.png'
import metalIcon from '../data/images/ICO_metal.png'
import nobleIcon from '../data/images/ICO_metal_noble.png'
import fissileIcon from '../data/images/ICO_fissile.png'
import antimatterIcon from '../data/images/ICO_antimatter.png'
import exoticIcon from '../data/images/ICO_exotics.png'

const resourceKey = {
  "water": waterIcon,
  "volatiles": volatileIcon,
  "metals": metalIcon,
  "nobleMetals": nobleIcon,
  "fissiles": fissileIcon,
  "antimatter": antimatterIcon,
  "exotics": exoticIcon
}

const BuildCostDisplay = (props) => {
  if (!props.data) return <p className="buildcost">-</p>
  let elements = []
  Object.entries(props.data).forEach(([resourceType, resourceQuantity]) => {
    if (!resourceQuantity) {
      return
    }
    if (elements.length > 0) elements.push(<span key={'div'+resourceType}> </span>)
    elements.push(<span className={`resourceSpan ${resourceType}`} key={resourceType}><img className="resourceIcon" alt={resourceKey} src={resourceKey[resourceType]}/>{round(resourceQuantity)}</span>)
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