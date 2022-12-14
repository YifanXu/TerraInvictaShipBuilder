import "./StatPage.css"
import RSTable from "../../components/RSTable";
import { useLoaderData } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Table from 'react-bootstrap/Table'
import BuildCostDisplay, { scaleBuildCost } from "../../components/BuildCostDisplay";

import StatPageDisplayTable from './StatPageDisplayTable.json'

function StatPage(props) {
  const statTypeBlock = StatPageDisplayTable[props.for]
  if (!statTypeBlock) throw Error("Invalid stat type for " + props.for)
  const data = useLoaderData()[props.for]
  const [filter, setFilter] = useState('')
  const [showOffcanvas, setshowOffcanvas] = useState(false)
  const [canvasContent, setCanvasContent] = useState({})
  const [showAlienParts, setShowAlienParts] = useState(false)

  const rowOnClick = (row) => {
    let flatObj = flattenObject(row)
    setCanvasContent(flatObj)
    setshowOffcanvas(true)
  }
  
  const flattenObject = (obj, result = {}, prefix = '') => {
    if (Array.isArray(obj)) {
      for (const i in obj) {
        flattenObject(obj[i], result, `${prefix}[${i}]`)
      }
      return;
    }

    switch (typeof obj) {
      case 'string':
        result[prefix] = obj || '-'
        break;
      case 'number':
      case 'bigint':
        result[prefix] = obj
        break
      case 'object':
        if (obj === null) {
          result[prefix] = "null"
        }
        else {
          for (const [key, val] of Object.entries(obj)) {
            flattenObject(val, result, prefix ? prefix + '.' + key : key)
          }
        }
        break;
      default:
        result[prefix] = JSON.stringify(obj)
        break
    }

    return result
  }

  let transformObject = statTypeBlock.costTransforms ? {...statTypeBlock.costTransforms} : undefined

  if (transformObject) {
    for (const [key, val] of Object.entries(transformObject)) {
      transformObject[key] = (entry) => <BuildCostDisplay data={scaleBuildCost(entry, val)}/>
    }
  }
  if (statTypeBlock.booleanColumns) {
    if (!transformObject) transformObject = {}
    for (const col of statTypeBlock.booleanColumns) {
      transformObject[col] = (entry) => entry ? <span className="tickMark">???</span> : <span className="crossMark">X</span>
    }
  }

  return (
    <div className="Stat">
      <h4>{statTypeBlock.title}</h4>
      <Form.Label>Search</Form.Label> 
      <Form.Control type="text" className="filterInput" value={filter} onChange={e => setFilter(e.target.value.toLowerCase())}/>
      <Form.Check type="switch" label="Show Alien Parts" checked={showAlienParts} onChange={() => setShowAlienParts(!showAlienParts)}/>
      <hr/>
      <RSTable 
        tooltips={statTypeBlock.tooltips} 
        transform={transformObject}
        data={Object.values(data)}
        filter={row => (showAlienParts || row.sumCost !== -1) && (!filter || row.friendlyName.toLowerCase().includes(filter))} 
        columns={statTypeBlock.columns} 
        display={statTypeBlock.columnDisplay} 
        rowOnClick={rowOnClick.bind(this)}
        key={props.for}
      ></RSTable>
      <Offcanvas show={showOffcanvas} onHide={() => setshowOffcanvas(false)} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Details: {canvasContent.friendlyName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table>
            <tbody>
              {Object.entries(canvasContent).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{val}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default StatPage;