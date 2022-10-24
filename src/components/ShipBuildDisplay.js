import RSTable from "./RSTable"
import SimpleTable from "./SimpleTable";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PropellantGraph from "./PropellantGraph";

function ShipBuildDisplay (props) {
  return (
    <Tabs id="buildDisplayTab" activeKey={props.tab} onSelect={props.setTab}>
        <Tab eventKey="general" title="General">
          <SimpleTable data={props.data.general}/>
        </Tab>
        <Tab eventKey="power" title="Power">
        <SimpleTable data={props.data.power}/>
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
        <Tab eventKey="propellant" title="Propellant">
          <PropellantGraph max={200} interval={5} dryMass={props.data.general.dryMass} ev={props.data.loadout.drive.EV_kps} thrust={props.data.loadout.drive.thrust_N * props.data.loadout.driveCount}/>
        </Tab>
    </Tabs>
  )
}

export default ShipBuildDisplay