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
import Alert from 'react-bootstrap/Alert'

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
  let localInput = localStorage.getItem('storedShips')
  if (localInput) {
    try {
      localInput = JSON.parse(localInput)
    }
    catch (e) {
      localInput = undefined
    }
  }
  const [storedShips, setStoredShips] = useState(localInput || { default: defaultShip })

  console.log(storedShips)

  const startingShip = (Object.values(storedShips)[0]) || {...defaultShip, name: ''}
  const [currentShip, setCurrentShip] = useState(startingShip)
  const [dataDisplay, setDataDisplay] = useState(calcShipStats(data, startingShip))
  const [iteration, setIteration] = useState(0) // Force build display to rerender
  const [displayTab, setDisplayTab] = useState('general')

  const [showAlert, setShowAlert] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [alertText, setAlertText] = useState("")
  const [importText, setImportText] = useState("")
  const [shipNameText, setShipNameText] = useState("")

  const updateShipHandler = (newShip) => {
    setCurrentShip(newShip)
    setDataDisplay(calcShipStats(data, newShip))
    setIteration(iteration + 1)
  }

  const openImportModal = () => {
    setShowImportModal(true)
    setImportText("")
  }

  const openManageModel = () => {
    setShowManageModal(true)
    setShipNameText(currentShip.name)
  }

  const saveShip = () => {
    if (!shipNameText) return;

    let updatedCurrentShip = {
      ...currentShip,
      name: shipNameText
    }

    setCurrentShip(updatedCurrentShip)

    const newShipList = {
      ...storedShips,
      [shipNameText]: updatedCurrentShip
    }

    setStoredShips(newShipList)
    localStorage.setItem('storedShips', JSON.stringify(newShipList))
    setShowManageModal(false)
  }

  const deleteShip = () => {
    const newShipList = {
      ...storedShips,
      [currentShip.name]: undefined
    }

    setAlertText(`"${currentShip.name}" has been deleted from local storage.`)
    setShowAlert(true)

    setStoredShips(newShipList)
    localStorage.setItem('storedShips', JSON.stringify(newShipList)) 
    updateShipHandler({...defaultShip, name: ''})   
    setShowDeleteModal(false)
  }

  const exportShip = () => {
    navigator.clipboard.writeText(JSON.stringify(currentShip))
    setAlertText("Ship copied to clipboard.")
    setShowAlert(true)
  }

  const importShip = () => {
    let importResult = null
    try {
      importResult = JSON.parse(importText)
    }
    catch (e) {
      
    }
    updateShipHandler(importResult)
    setShowImportModal(false)
  }
  
  return (
    <div className="BuildSim">
      <h4>Build Simulator</h4>
      {
        showAlert 
        ? <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>{alertText}</Alert> 
        : null
      }
      <Row>
        <Form.Label className="col-1">Ship</Form.Label>
        <Col className="col-7">
          <InputDropdown items={storedShips} val={currentShip.name || "Unsaved" } handler={v => updateShipHandler({...storedShips[v]})}/> 
        </Col>
        <ButtonGroup className="col-3">
          <Button className="btn btn-secondary col-6" onClick={openImportModal}>Import</Button>
          <Button className="btn btn-secondary col-6" onClick={exportShip}>Export</Button>
          <Button className="btn btn-secondary col-6" onClick={openManageModel}>Save</Button>
          <Button className="btn btn-danger col-6" onClick={() => setShowDeleteModal(true)} disabled={!currentShip.name || !storedShips[currentShip.name]}>Delete</Button>
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
          <Button variant="primary" onClick={importShip}>
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
          <Button variant="primary" onClick={saveShip} disabled={!shipNameText}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Ship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Text>"{currentShip.name}" will be deleted from your local browser storage</Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteShip}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BuildSim;