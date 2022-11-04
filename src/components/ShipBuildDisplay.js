import "./ShipBuildDisplay.css"
import RSTable from "./RSTable"
import SimpleTable from "./SimpleTable";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup'
import PropellantGraph from "./PropellantGraph";
import BuildCostDisplay from "./BuildCostDisplay";

function ShipBuildDisplay (props) {
  return (
    <Tabs id="buildDisplayTab" activeKey={props.tab} onSelect={props.setTab}>
        <Tab eventKey="general" title="General">
            <SimpleTable data={props.data.general}/>
            {
              props.data.validation.length > 0 ?
              <ListGroup as="ul" className="validation position-static">
                <ListGroup.Item><b>Validation Errors:</b></ListGroup.Item>
                {props.data.validation.map(complaint => <ListGroup.Item>{complaint}</ListGroup.Item>)}
              </ListGroup>
              : <p className="validationPassText">All validation passed</p>
            }
        </Tab>
        <Tab eventKey="power" title="Power">
          <SimpleTable data={props.data.power}/>
        </Tab>
        <Tab eventKey="propulsion" title="Propulsion">
          <SimpleTable data={props.data.propulsion}/>
        </Tab>
        <Tab eventKey="mass" title="Mass">
          <RSTable 
            data={props.data.massTable} 
            filter={row => true} 
            columns={['source', 'unit', 'count', 'total']} 
            display={['Source', 'Unit', 'Count', 'Total']}
          ></RSTable>
        </Tab>
        <Tab eventKey="crew" title="Crew">
          <RSTable 
            data={props.data.crewTable} 
            filter={row => true} 
            columns={['source', 'unit', 'count', 'total']} 
            display={['Source', 'Unit', 'Count', 'Total']}
          ></RSTable>
        </Tab>
        <Tab eventKey="research" title="Research">
          <RSTable 
            data={props.data.researchTable} 
            filter={row => true} 
            columns={['source', 'unit', 'count', 'total']} 
            display={['Source', 'Unit', 'Count', 'Total']}
          ></RSTable>
        </Tab>
        <Tab eventKey="build" title="Build">
          <RSTable 
            data={props.data.buildTable} 
            filter={row => true}
            transform={{
              unit: c => <BuildCostDisplay data={c}/>,
              total: c => <BuildCostDisplay data={c}/>
            }}
            columns={['source', 'unit', 'count', 'total']} 
            display={['Source', 'Unit', 'Count', 'Total']}
          ></RSTable>
        </Tab>
        <Tab eventKey="propellant" title="Propellant">
          <PropellantGraph max={200} interval={5} dryMass={props.data.general.dryMass} ev={props.data.loadout.drive.EV_kps} thrust={props.data.loadout.drive.thrust_N * props.data.loadout.driveCount}/>
        </Tab>
    </Tabs>
  )
}

export default ShipBuildDisplay