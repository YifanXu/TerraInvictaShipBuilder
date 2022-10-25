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
    hullWeapons: shipDesign.hullWeapons.map(w => data.weapons[w])
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
    power: {
      coolingType: loadout.drive.cooling,
      drivePower: loadout.drive.cooling === 'Open' ? 0 : loadout.drive.thrust_N * loadout.driveCount * loadout.drive.EV_kps / 2000000,
      crewPower: 0, // Crew * 0.000005 GW
      batteryPower: loadout.battery.rechargeRate_GJs, // Battery recharge rate
      powerOutput: 0, // MAX(drivePower, crewPower + batteryPower)
      maxGeneratedPower: loadout.powerPlant.maxOutput_GW,
      powerPlantEfficency: loadout.powerPlant.efficiency,
      driveWasteHeat: 0,
      crewWasteHeat: 0, // Crew * 0.00375 GW
      wasteHeat: 0,
    },
    crew: {
      hull: loadout.hull.crew,
      powerPlant: loadout.powerPlant.crew,
      radiator: loadout.radiator.crew,
    }
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

  result.general.crew = crewSum

  // Power
  result.power.crewPower = crewSum * 0.000005
  result.power.powerOutput = Math.max(result.power.drivePower, result.power.crewPower + result.power.batteryPower)
  result.power.driveWasteHeat = result.power.powerOutput * (1 - result.power.powerPlantEfficency)
  result.power.crewWasteHeat = crewSum * 0.00375;
  result.power.wasteHeat = Math.max(result.power.driveWasteHeat, result.power.crewWasteHeat)


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
    console.log(w)
    massSum += addEntryToDetailTable(massTable, w.friendlyName, w.mass_tons, 1)
  }

  for (const w of loadout.hullWeapons) {
    console.log(w)
    massSum += addEntryToDetailTable(massTable, w.friendlyName, w.mass_tons, 1)
  }

  result.general.dryMass = massSum;
  massSum += addEntryToDetailTable(massTable, 'Propellant', 100, loadout.propellantCount)
  result.general.wetMass = massSum;


  // Propulsion
  result.general.cruiseAccel = loadout.drive.thrust_N * loadout.driveCount / result.general.wetMass / 9.81
  result.general.combatAccel = result.general.cruiseAccel * loadout.drive.thrustCap
  result.general.cruiseDV = 2.3 * loadout.drive.EV_kps * Math.log10(result.general.wetMass / result.general.dryMass)

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
  console.log(powerplant)
  switch (requirement) {
    case 'Any_General':
      return powerplant.generalUse;
    case 'Any_Magnetic_Confinement_Fusion':
      return powerplant.powerPlantClass === 'Mirrored_Magnetic_Confinement_Fusion' || powerplant.powerPlantClass === 'Toroid_Magnetic_Confinement_Fusion';
    default:
      return powerplant.powerPlantClass === requirement
  }
}