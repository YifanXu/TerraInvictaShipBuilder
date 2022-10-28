import "./BuildSim.css"

import ShipDesigner from "../components/ShipDesigner";
import ShipBuildDisplay from "../components/ShipBuildDisplay";
import calcShipStats from "../data/shipCalculator"
import { useLoaderData } from 'react-router-dom'
import { useState } from 'react'
import Col from 'react-bootstrap/Col'

const defaultShip = {
  hull: 'Gunship',
  drive: 'Apex Solid Rocket',
  driveCount: 6,
  propellantCount: 0,
  powerPlant: 'Fuel Cell I',
  radiator: 'Aluminum Fin',
  battery: 'Lithium-Ion Battery',
  noseWeapons: [],
  hullWeapons: [],
  utilitySlots: [],
  frontArmor: 'Steel Armor',
  sideArmor: 'Steel Armor',
  tailArmor: 'Steel Armor',
  frontArmorCount: 0,
  sideArmorCount: 0,
  tailArmorCount: 0,
}

function BuildSim() {
  const data = useLoaderData()

  const [currentShip, setCurrentShip] = useState(defaultShip)
  const [dataDisplay, setDataDisplay] = useState(calcShipStats(data, defaultShip))
  const [iteration, setIteration] = useState(0) // Force build display to rerender
  const [displayTab, setDisplayTab] = useState('general')

  const updateShipHandler = (newShip) => {
    setCurrentShip(newShip)
    setDataDisplay(calcShipStats(data, newShip))
    setIteration(iteration + 1)
  }
  
  return (
    <div className="BuildSim">
      <h4>Build Simulator</h4>
      <div className="buildBody row">
        <Col className="col-md-6 col-12">
          <ShipDesigner data={data} currentShip={currentShip} handler={updateShipHandler}/>
        </Col>
        <Col className="col-md-6 col-12">
          <ShipBuildDisplay key={iteration} data={dataDisplay} tab={displayTab} setTab={setDisplayTab}/>
        </Col>
      </div>
    </div>
  );
}

export default BuildSim;