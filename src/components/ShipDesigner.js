import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputDropdown from './InputDropdown'
import ModifiableInputList from './ModifiableInputList'

function ShipDesigner(props) {
  const currentShip = props.currentShip
  const getAttributeHandler = (attribute) => {
    return (value) => props.handler({
      ...currentShip,
      [attribute]: value
    })
  }

  return (
    <div className="shipDesigner">
      <Form onSubmit={e => e.preventDefault()}>
       <Form.Group as={Col}>
          <Form.Label>Hull</Form.Label>
          <InputDropdown items={Object.keys(props.data.hulls)} val={currentShip.hull} handler={getAttributeHandler('hull')}/>
        </Form.Group>
        <hr/>
        <Row className="mb-3">
          <Form.Group className="col-md-8 col-12" as={Col}>
            <Form.Label>Drive</Form.Label>
            <InputDropdown items={Object.keys(props.data.drives)} val={currentShip.drive} handler={getAttributeHandler('drive')}/>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6 col-12" as={Col}>
            <Form.Label>Count</Form.Label>
            <Form.Control type="number" min="1" max="6" value={currentShip.driveCount} onChange={e => getAttributeHandler('driveCount')(e.target.value)}/>
          </Form.Group>
          <Form.Group className="col-md-2 col-sm-6 col-12" as={Col}>
            <Form.Label>Propellant</Form.Label>
            <Form.Control type="number" min="0" value={currentShip.propellantCount} onChange={e => getAttributeHandler('propellantCount')(e.target.value)}/>
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
          <Col className="col-md-9 col-12">
            <InputDropdown items={Object.keys(props.data.powerplants)} val={currentShip.powerPlant} handler={getAttributeHandler('powerPlant')}/>
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Radiator</Form.Label>
          <Col className="col-md-9 col-12">
            <InputDropdown items={Object.keys(props.data.radiators)} val={currentShip.radiator} handler={getAttributeHandler('radiator')}/>
          </Col>
        </Form.Group>
        <Form.Group className="row">
          <Form.Label className='col-md-3 col-12'>Battery</Form.Label>
          <Col className="col-md-9 col-12">
            <InputDropdown items={Object.keys(props.data.batteries)} val={currentShip.battery} handler={getAttributeHandler('battery')}/>
          </Col>
        </Form.Group>
        <hr/>
        <ModifiableInputList
          title="Nose Weapons"
          val={currentShip.noseWeapons}
          getCount={weapon => props.data.weapons[weapon].slotCount}
          capacity={props.data.hulls[currentShip.hull].noseHardpoints}
          items={props.data.noseWeaponNames}
          handler={getAttributeHandler('noseWeapons')}
        />
        <hr/>
        <ModifiableInputList
          title="Hull Weapons"
          val={currentShip.hullWeapons}
          getCount={weapon => props.data.weapons[weapon].slotCount}
          capacity={props.data.hulls[currentShip.hull].hullHardpoints}
          items={props.data.hullWeaponNames}
          handler={getAttributeHandler('hullWeapons')}
        />
      </Form>
    </div>
  );
}

export default ShipDesigner;