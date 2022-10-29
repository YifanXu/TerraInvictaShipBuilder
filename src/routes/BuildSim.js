import "./BuildSim.css"

import ShipDesigner from "../components/ShipDesigner";
import ShipBuildDisplay from "../components/ShipBuildDisplay";
import calcShipStats from "../data/shipCalculator"
import { useLoaderData } from 'react-router-dom'
import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import InputDropdown from "../components/InputDropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'

const defaultShip = {
  name: 'default',
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
  const [storedShips, setStoredShips] = useState(localStorage.getItem('storedShips') || { default: defaultShip })

  const [currentShip, setCurrentShip] = useState(defaultShip)
  const [dataDisplay, setDataDisplay] = useState(calcShipStats(data, defaultShip))
  const [iteration, setIteration] = useState(0) // Force build display to rerender
  const [displayTab, setDisplayTab] = useState('general')

  const [showImportModal, setShowImportModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [importText, setImportText] = useState("")
  const [shipNameText, setShipNameText] = useState("")

  const updateShipHandler = (newShip) => {
    setCurrentShip(newShip)
    setDataDisplay(calcShipStats(data, newShip))
    setIteration(iteration + 1)
  }

  const openManageModel = () => {
    setShowManageModal(true)
    setShipNameText(currentShip.name)
  }

  const saveShip = () => {
  }
  
  return (
    <div className="BuildSim">
      <h4>Build Simulator</h4>
      <Row>
        <Form.Label className="col-1">Ship</Form.Label>
        <Col className="col-7">
          <InputDropdown items={storedShips} val={currentShip.name || "Unsaved" } handler={v => setCurrentShip(storedShips[v])}/> 
        </Col>
        <ButtonGroup className="col-3">
          <Button className="btn btn-secondary col-6" onClick={openManageModel}>Save As</Button>
          <Button className="btn btn-secondary col-6" onClick={() => setShowImportModal(true)}>Import</Button>
          <Button className="btn btn-secondary col-6">Export</Button>
        </ButtonGroup>
      </Row>
      <hr/>
      <div className="buildBody row">
        <Col className="col-md-6 col-12">
          <ShipDesigner data={data} currentShip={currentShip} handler={updateShipHandler}/>
        </Col>
        <Col className="col-md-6 col-12">
          <ShipBuildDisplay key={iteration} data={dataDisplay} tab={displayTab} setTab={setDisplayTab}/>
        </Col>
      </div>
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Paste text here...</Form.Label>
          <Form.Control as="textarea" rows={15} val={importText} onChange={e => setImportText(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowImportModal(false)}>
            Import
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showManageModal} onHide={() => setShowManageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Save As</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Text>This ship will be saved to your local browser storage.</Form.Text>
          <Form.Control type="text" placeholder="Ship Name" value={shipNameText} onChange={e => setShipNameText(e.target.value)}></Form.Control>
          <Form.Text className="overwriteWarn">{storedShips[shipNameText] ? `This will overwrite "${shipNameText}"` : ''}</Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowManageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowManageModal(false)} disabled={!shipNameText}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BuildSim;