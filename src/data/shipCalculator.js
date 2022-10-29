import constants from './calculationConstants.json'

function addEntryToDetailTable (table, source, unit, count) {
  let total = unit * count

  if (table[source]) {
    if (unit !== table[source].unit) {
      throw new Error(`Incosistent Unit prices for ${source}!`)
    }

    table[source].count += round(count)
    table[source].total += round(total)
  }
  else {
    table[source] = {
      source,
      unit,
      count: round(count),
      total: round(total)
    }
  }

  return total
}

const round = num => Math.round(num * 100) / 100 

export default function calculateStatistics (data, shipDesign) {
  const loadout = {
    hull: data.hulls[shipDesign.hull],
    drive: data.drives[shipDesign.drive],
    driveCount: shipDesign.driveCount,
    propellantCount: shipDesign.propellantCount,
    powerPlant: data.powerplants[shipDesign.powerPlant],
    radiator: data.radiators[shipDesign.radiator],
    battery: data.batteries[shipDesign.battery],
    noseWeapons: shipDesign.noseWeapons.map(w => data.weapons[w]),
    hullWeapons: shipDesign.hullWeapons.map(w => data.weapons[w]),
    utilitySlots: shipDesign.utilitySlots.map(w => data.utility[w]),
    frontArmor: data.armor[shipDesign.frontArmor],
    sideArmor: data.armor[shipDesign.sideArmor],
    tailArmor: data.armor[shipDesign.tailArmor],
    frontArmorCount: shipDesign.frontArmorCount,
    sideArmorCount: shipDesign.sideArmorCount,
    tailArmorCount: shipDesign.tailArmorCount,
  }

  // Copied values
  let result = {
    general: {
      dryMass: 0,
      wetMass: 0,
      cruiseAccel: 0,
      combatAccel: 0,
      cruiseDV: 0,
      heatsinkCap: 0,
      batteryCap: loadout.battery.energyCapacity_GJ,
      constructionTime: loadout.hull.baseConstructionTime_days,
    },
    propulsion: {
      baseThrust: loadout.drive.thrust_N * loadout.driveCount,
      thrustMultiplier: 1,
      finalThrust: 0,
      finalThrustRating: 0,
      baseEV: loadout.drive.EV_kps,
      evMultiplier: 1,
      finalEV: 0,
      finalEVRating: 0,
      cruiseAccel: 0,
      combatAccel: 0,
      cruiseDV: 0,
    },
    power: {
      coolingType: loadout.drive.cooling,
      drivePower: loadout.drive.cooling === 'Open' ? 0 : loadout.drive.thrust_N * loadout.driveCount * loadout.drive.EV_kps / constants.drivePowerRatio,
      crewPower: 0, // Crew * 0.000005 GW
      batteryPower: loadout.battery.rechargeRate_GJs, // Battery recharge rate
      powerOutput: 0, // MAX(drivePower, crewPower + batteryPower)
      maxGeneratedPower: loadout.powerPlant.maxOutput_GW,
      powerPlantEfficency: loadout.powerPlant.efficiency,
      driveWasteHeat: 0,
      crewWasteHeat: 0, // Crew * 0.00375 GW
      wasteHeat: 0,
    },
    validation: []
  }

  // Figure out crew

  let crewTable = {}

  let crewSum = 0
  
  crewSum += addEntryToDetailTable(crewTable, loadout.hull.friendlyName, loadout.hull.crew, 1)
  crewSum += addEntryToDetailTable(crewTable, loadout.powerPlant.friendlyName, loadout.powerPlant.crew, 1)
  crewSum += addEntryToDetailTable(crewTable, loadout.radiator.friendlyName, loadout.radiator.crew, 1)
  crewSum += addEntryToDetailTable(crewTable, loadout.battery.friendlyName, loadout.battery.crew, 1)

  for (const w of loadout.noseWeapons) {
    crewSum += addEntryToDetailTable(crewTable, w.friendlyName, w.crew, 1)
  }

  for (const w of loadout.hullWeapons) {
    crewSum += addEntryToDetailTable(crewTable, w.friendlyName, w.crew, 1)
  }

  for (const util of loadout.utilitySlots) {
    crewSum += addEntryToDetailTable(crewTable, util.friendlyName, util.crew, 1)
  }

  result.general.crew = crewSum

  // Utility
  let occupiedSlots = []
  loadout.utilitySlots.forEach((util, i) => {
    if (util.type === 'heatsink') {
      result.general.heatsinkCap += util.heatCapacity_GJ
    }
    else {
      // Check module grouping
      if (util.grouping !== -1) {
        if (occupiedSlots[util.grouping]) {
          result.validation.push(`${occupiedSlots[util.grouping].friendlyName} cannot co-exist with ${util.friendlyName} (Group ${util.grouping})`)
        }
        else {
          occupiedSlots[util.grouping] = util
        }
      }

      // Check drive requirement
      if (util.requiresHydrogenPropellant && loadout.drive.propellant !== 'Hydrogen') {
        result.validation.push(`${util.friendlyName} requires hydrogen propellant, but your drive uses ${loadout.drive.propellant}.`)
      }
      if (util.requiresNuclearDrive && !loadout.drive.driveClassification.includes("Fission")) {
        result.validation.push(`${util.friendlyName} requires nuclear drive, but your drive is classified as "${loadout.drive.driveClassification}".`)
      }
      else if (util.requiresFusionDrive && !loadout.drive.driveClassification.includes("Fusion")) {
        result.validation.push(`${util.friendlyName} requires nuclear drive, but your drive is classified as "${loadout.drive.driveClassification}".`)
      }

      if (util.thrustMultiplier && util.thrustMultiplier !== 1) {
        console.log(util.thrustMultiplier)
        result.propulsion.thrustMultiplier *= util.thrustMultiplier
      }

      if (util.EVMultiplier && util.EVMultiplier !== 1) {
        result.propulsion.evMultiplier *= util.EVMultiplier
      }
    }
  })

  // Power
  result.power.crewPower = crewSum * constants.crewPower
  result.power.powerOutput = Math.max(result.power.drivePower, result.power.crewPower + result.power.batteryPower)
  result.power.driveWasteHeat = result.power.powerOutput * (1 - result.power.powerPlantEfficency)
  result.power.crewWasteHeat = crewSum * constants.crewWasteHeat;
  result.power.wasteHeat = Math.max(result.power.driveWasteHeat, result.power.crewWasteHeat)

  // Power Validation
  if (!isDriveCompatible(loadout.drive.requiredPowerPlant, loadout.powerPlant)) {
    result.validation.push(`${loadout.drive.friendlyName} is incompatible with ${loadout.powerPlant.friendlyName}`)
  }

  if (result.power.powerOutput > result.power.maxGeneratedPower) {
    result.validation.push(`Power required (${result.power.powerOutput} GW) exceeds maximum generated power (${result.power.maxGeneratedPower} GW) from ${loadout.powerPlant.friendlyName}`)
  }

  // Mass
  let massTable = {}
  let massSum = 0

  massSum += addEntryToDetailTable(massTable, loadout.hull.friendlyName, loadout.hull.mass_tons, 1)
  massSum += addEntryToDetailTable(massTable, loadout.drive.friendlyName, loadout.drive.flatMass_tons, loadout.driveCount)
  massSum += addEntryToDetailTable(massTable, loadout.powerPlant.friendlyName, loadout.powerPlant.specificPower_tGW, result.power.powerOutput)
  massSum += addEntryToDetailTable(massTable, loadout.radiator.friendlyName, loadout.radiator.specificMass_tonGW, result.power.wasteHeat)
  massSum += addEntryToDetailTable(massTable, loadout.battery.friendlyName, loadout.battery.mass_tons, 1)
  massSum += addEntryToDetailTable(massTable, 'Crew', 4, crewSum)

  for (const w of loadout.noseWeapons) {
    massSum += addEntryToDetailTable(massTable, w.friendlyName, w.mass_tons, 1)
  }

  for (const w of loadout.hullWeapons) {
    massSum += addEntryToDetailTable(massTable, w.friendlyName, w.mass_tons, 1)
  }

  for (const util of loadout.utilitySlots) {
    massSum += addEntryToDetailTable(massTable, util.friendlyName, util.mass_tons, 1)
  }

  // Armor
  massSum += addEntryToDetailTable(massTable, `FRONT: ${loadout.frontArmor.friendlyName}`, Math.round(Math.PI / loadout.frontArmor.heatofVaporization_MJkg * loadout.hull.width_m * loadout.hull.width_m * 10) / 10, loadout.frontArmorCount)
  massSum += addEntryToDetailTable(massTable, `SIDE: ${loadout.sideArmor.friendlyName}`, Math.round(Math.PI * 2 / loadout.frontArmor.heatofVaporization_MJkg * loadout.hull.width_m * loadout.hull.length_m * 10) / 10, loadout.sideArmorCount)
  massSum += addEntryToDetailTable(massTable, `TAIL: ${loadout.tailArmor.friendlyName}`, Math.round(Math.PI / loadout.frontArmor.heatofVaporization_MJkg * loadout.hull.width_m * loadout.hull.width_m * 10) / 10, loadout.tailArmorCount)

  result.general.dryMass = massSum;
  massSum += addEntryToDetailTable(massTable, 'Propellant', 100, loadout.propellantCount)
  result.general.wetMass = massSum;


  // Propulsion
  result.propulsion.finalThrust = result.propulsion.baseThrust * result.propulsion.thrustMultiplier
  result.propulsion.finalThrustRating = Math.round(constants.thrustRatingOutputScale * Math.log(result.propulsion.finalThrust * constants.thrustRatingInputScale) * 10) / 10
  result.propulsion.finalEV = result.propulsion.baseEV * result.propulsion.evMultiplier
  result.propulsion.finalEVRating = Math.round(constants.evRatingOutputScale * Math.log(result.propulsion.finalEV * constants.evRatingInputScale) * 10) / 10

  result.propulsion.cruiseAccel = result.propulsion.finalThrust / result.general.wetMass / constants.g
  result.propulsion.combatAccel = result.propulsion.cruiseAccel * loadout.drive.thrustCap
  result.propulsion.cruiseDV = constants.cruiseDVMutliplier * result.propulsion.finalEV * Math.log10(result.general.wetMass / result.general.dryMass)

  result.general.cruiseAccel = result.propulsion.cruiseAccel
  result.general.combatAccel = result.propulsion.combatAccel
  result.general.cruiseDV = result.propulsion.cruiseDV

  result.crewTable = Object.values(crewTable)
  result.massTable = Object.values(massTable)

  result.crewTable.push({
    source: 'Total',
    unit: '',
    count: '',
    total: round(crewSum)
  })

  result.massTable.push({
    source: 'Total',
    unit: '',
    count: '',
    total: round(massSum)
  })

  result.loadout = loadout

  return result
}

export function isDriveCompatible (requirement, powerplant) {
  switch (requirement) {
    case 'Any_General':
      return powerplant.generalUse;
    case 'Any_Magnetic_Confinement_Fusion':
      return powerplant.powerPlantClass === 'Mirrored_Magnetic_Confinement_Fusion' || powerplant.powerPlantClass === 'Toroid_Magnetic_Confinement_Fusion';
    default:
      return powerplant.powerPlantClass === requirement
  }
}