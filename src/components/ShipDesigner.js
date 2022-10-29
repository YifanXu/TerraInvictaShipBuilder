import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputDropdown from './InputDropdown'
import ModifiableInputList from './ModifiableInputList'
import { isDriveCompatible } from '../data/shipCalculator'
import { useState } from 'react'

function ShipDesigner(props) {
  const currentShip = props.currentShip
  const [useIndividualArmor, setUseIndividualArmor] = useState(false)
  const [showAlien, setShowAlien] = useState(false)

  const getAttributeHandler = (attribute) => {
    return (value) => props.handler({
      ...currentShip,
      [attribute]: value
    })
  }

  const setBestReactor = () => {
    const validType = props.data.drives[props.currentShip.drive].requiredPowerPlant
    const filteredReactors = Object.values(props.data.powerplants).filter(p => isDriveCompatible(validType, p))

    let bestReactor = ''
    let bestSpecPower = Infinity
    for (const reactor of filteredReactors) {
      if (reactor.specificPower_tGW < bestSpecPower) {
        bestReactor = reactor.friendlyName
        bestSpecPower = reactor.specificPower_tGW
      }
    }

    getAttributeHandler('powerPlant')(bestReactor)
  }

  const handleFrontArmorSelect = (newVal) => {
    if (!useIndividualArmor) {
      props.handler({
        ...currentShip,
        frontArmor: newVal,
        sideArmor: newVal,
        tailArmor: newVal
      })
    }
    else {
      getAttributeHandler('frontArmor')(newVal);
    }
  }

  const toggleUseIndividualArmor = () => {
    if (useIndividualArmor) {
      props.handler({
        ...currentShip,
        sideArmor: currentShip.frontArmor,
        tailArmor: currentShip.frontArmor
      })
    }
    setUseIndividualArmor(!useIndividualArmor)
  }

  return (
    <div className="shipDesigner">
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Check type="switch" label="Show Non-researchable Parts" val={showAlien} onChange={() => setShowAlien(!showAlien)}/>
        <hr/>
       <Form.Group as={Col}>
          <Form.Label>Hull</Form.Label>
          <InputDropdown items={props.data.hulls} val={currentShip.hull} handler={getAttributeHandler('hull')} showalien={showAlien ? 1 : 0}/>
        </Form.Group>
        <hr/>
        <Row className="mb-3">
          <Form.Group className="col-md-8 col-12" as={Col}>
            <Form.Label>Drive</Form.Label>
            <InputDropdown items={props.data.drives} val={currentShip.drive} handler={getAttributeHandler('drive')} showalien={showAlien ? 1 : 0}/>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6 col-12" as={Col}>
            <Form.Label>Count</Form.Label>
            <Form.Control type="number" min="1" max="6" value={currentShip.driveCount} onChange={e => getAttributeHandler('driveCount')(e.target.value)} showalien={showAlien ? 1 : 0}/>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6 col-12" as={Col}>
            <Form.Label>Propellant</Form.Label>
            <Form.Control type="number" min="0" value={currentShip.propellantCount} onChange={e => getAttributeHandler('propellantCount')(e.target.value)} showalien={showAlien ? 1 : 0}/>
          </Form.Group>
          <Row>
            <Form.Text className="col-md-4 col-12">{`Thrust: ${props.data.drives[currentShip.drive].thrust_N * currentShip.driveCount}N (${Math.round(1.445 * Math.log(props.data.drives[currentShip.drive].thrust_N * currentShip.driveCount * 0.001981) * 10) / 10})`}</Form.Text>
            <Form.Text className="col-md-3 col-12">{`EV: ${props.data.drives[currentShip.drive].EV_kps}kps (${props.data.drives[currentShip.drive].evRating})`}</Form.Text>
            <Form.Text className="col-md-5 col-12">{`Plant: ${props.data.drives[currentShip.drive].requiredPowerPlant}`}</Form.Text>
            {/* <Form.Text className="col-md-5 col-12">{`Power: ${props.data.drives[drive].thrust_N * props.data.drives[drive].EV_kps * driveCount / 1000000}`}</Form.Text> */}
          </Row>
        </Row>
        <hr/>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Power Plant</Form.Label>
          <Col className="col-md-7 col-8" style={{'paddingRight': '0px'}}>
            <InputDropdown 
              items={props.data.powerplants} 
              val={currentShip.powerPlant} 
              handler={getAttributeHandler('powerPlant')} 
              warnItem={v => !isDriveCompatible(props.data.drives[props.currentShip.drive].requiredPowerPlant, v)} 
              showalien={showAlien ? 1 : 0}
            />
          </Col>
          <Col className="col-md-2 col-4" style={{'paddingLeft': '0px'}}>
            <Button className="btn btn-secondary" style={{width: '100%'}} onClick={setBestReactor}>Best</Button>
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Radiator</Form.Label>
          <Col className="col-md-9 col-12">
            <InputDropdown items={props.data.radiators} val={currentShip.radiator} handler={getAttributeHandler('radiator')} showalien={showAlien ? 1 : 0}/>
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Battery</Form.Label>
          <Col className="col-md-9 col-12">
            <InputDropdown items={props.data.batteries} val={currentShip.battery} handler={getAttributeHandler('battery')} showalien={showAlien ? 1 : 0}/>
          </Col>
        </Form.Group>
        <hr/>
        <ModifiableInputList
          title="Nose Weapons"
          val={currentShip.noseWeapons}
          getCount={weapon => props.data.weapons[weapon].slotCount}
          capacity={props.data.hulls[currentShip.hull].noseHardpoints}
          items={props.data.weapons}
          handler={getAttributeHandler('noseWeapons')}
          showalien={showAlien ? 1 : 0}
        />
        <hr/>
        <ModifiableInputList
          title="Hull Weapons"
          val={currentShip.hullWeapons}
          getCount={weapon => props.data.weapons[weapon].slotCount}
          capacity={props.data.hulls[currentShip.hull].hullHardpoints}
          items={props.data.weapons}
          handler={getAttributeHandler('hullWeapons')}
          showalien={showAlien ? 1 : 0}
        />
        <hr/>
        <ModifiableInputList
          title="Utility Slots"
          val={currentShip.utilitySlots}
          getCount={weapon => 1}
          capacity={props.data.hulls[currentShip.hull].internalModules}
          items={props.data.utility}
          handler={getAttributeHandler('utilitySlots')}
          showalien={showAlien ? 1 : 0}
        />
        <hr/>
        <Form.Check type="checkbox" label="Customize individual armor section" value={useIndividualArmor} onChange={toggleUseIndividualArmor}/>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Front Armor</Form.Label>
          <Col className="col-md-7 col-8">
            <InputDropdown items={props.data.armor} val={currentShip.frontArmor} handler={handleFrontArmorSelect} showalien={showAlien ? 1 : 0}/>
          </Col>
          <Col className="col-md-2 col-4">
          <Form.Control type="number" min="0" value={currentShip.frontArmorCount} onChange={e => getAttributeHandler('frontArmorCount')(e.target.value)}/>
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Side Armor</Form.Label>
          <Col className="col-md-7 col-8">
            <InputDropdown items={props.data.armor} val={currentShip.sideArmor} handler={getAttributeHandler('sideArmor')} disabled={!useIndividualArmor} showalien={showAlien ? 1 : 0}/>
          </Col>
          <Col className="col-md-2 col-4">
          <Form.Control type="number" min="0" value={currentShip.sideArmorCount} onChange={e => getAttributeHandler('sideArmorCount')(e.target.value)}/>
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Tail Armor</Form.Label>
          <Col className="col-md-7 col-8">
            <InputDropdown items={props.data.armor} val={currentShip.tailArmor} handler={getAttributeHandler('tailArmor')} disabled={!useIndividualArmor} showalien={showAlien ? 1 : 0}/>
          </Col>
          <Col className="col-md-2 col-4">
          <Form.Control type="number" min="0" value={currentShip.tailArmorCount} onChange={e => getAttributeHandler('tailArmorCount')(e.target.value)}/>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default ShipDesigner;