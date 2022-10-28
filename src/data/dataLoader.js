import drives from './drives.json'
import powerplants from './powerplants.json'
import techs from './techs.json'
import radiators from './radiators.json'
import hulls from './hulls.json'
import batteries from './batteries.json'
import weapons from './weapons.json'
import armor from './armor.json'
import utility from './utility.json'

import constants from './calculationConstants.json'

var dataInitialized = false;

export default function loader () {
  if (!dataInitialized) {
    dataInitialized = true
  }
  Object.values(drives).forEach(drive => {
    drive.thrustRating = Math.round(constants.thrustRatingOutputScale * Math.log(drive.thrust_N * constants.thrustRatingInputScale) * 10) / 10
    drive.evRating = Math.round(constants.evRatingOutputScale * Math.log(drive.EV_kps * constants.evRatingInputScale) * 10) / 10
    drive.sumCost = drive.requiredProjectName ? techs[drive.requiredProjectName].sumCost : 0;
  })

  Object.values(powerplants).forEach(plant => {
    plant.sumCost = plant.requiredProjectName ? techs[plant.requiredProjectName].sumCost : 0;
  })

  Object.values(radiators).forEach(rad => {
    rad.specificMass_tonGW = Math.round(1 / rad.specificPower_2s_KWkg * 10000) / 10
    rad.sumCost = rad.requiredProjectName ? techs[rad.requiredProjectName].sumCost : 0;
  })

  Object.values(hulls).forEach(hull => {
    hull.sumCost = hull.requiredProjectName ? techs[hull.requiredProjectName].sumCost : 0;
  })
  
  Object.values(batteries).forEach(bat => {
    bat.sumCost = bat.requiredProjectName ? techs[bat.requiredProjectName].sumCost : 0;
  })

  Object.values(armor).forEach(a => {
    a.sumCost = a.requiredProjectName ? techs[a.requiredProjectName].sumCost : 0;
  })

  Object.values(utility).forEach(a => {
    a.sumCost = a.requiredProjectName ? techs[a.requiredProjectName].sumCost : 0;
  })

  const noseWeaponNames = [];
  const hullWeaponNames = [];
  Object.values(weapons).forEach(weapon => {
    weapon.sumCost = weapon.requiredProjectName ? techs[weapon.requiredProjectName].sumCost : 0;
    if (weapon.mountLocation === 'nose') {
      noseWeaponNames.push(weapon.friendlyName)
    }
    else {
      hullWeaponNames.push(weapon.friendlyName)
    }
  })

  noseWeaponNames.sort((a,b) => weapons[a].slotCount - weapons[b].slotCount)
  hullWeaponNames.sort((a,b) => weapons[a].slotCount - weapons[b].slotCount)

  return {
    drives,
    powerplants,
    techs,
    radiators,
    hulls,
    batteries,
    weapons,
    armor,
    utility,
    noseWeaponNames,
    hullWeaponNames
  }
}

function calcCostFor (projName, calcualatedProjects = []) {
  let proj = techs[projName]
  let sumCost = proj.researchCost
  for (const prereq of proj.prereqs) {
    if (prereq && !calcualatedProjects.includes(projName)) {
      sumCost += calcCostFor(prereq, calcualatedProjects)
    }
  }
  calcualatedProjects.push(projName)
  return sumCost
}

export function sumCost (technologies) {
  let sum = 0
  let researched = []
  for (const tech of technologies) {
    sum += calcCostFor(tech, researched)
  }
  return sum
}