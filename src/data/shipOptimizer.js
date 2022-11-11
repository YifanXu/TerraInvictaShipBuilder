import constants from './calculationConstants.json'

// Approximate value of fuel materials
const defaultFuelEval = {
  "water": 1,
  "volatiles": 5,
  "metals": 7,
  "nobleMetals": 42,
  "fissiles": 100,
  "antimatter": 5000,
  "exotics": 2500
}

// How much fuel does it take to reach set drive/
export function CompareByFuel (drive, powerplant, targetCruiseAccel, targetKps, baseMass) {
  // How many engines?
  
}