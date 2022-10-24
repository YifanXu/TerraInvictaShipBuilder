import "./StatPage.css"
import RSTable from "../../components/RSTable";
import { useLoaderData } from 'react-router-dom'
import { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Table from 'react-bootstrap/Table'

import StatPageDisplayTable from './StatPageDisplayTable.json'

function StatPage(props) {
  const statTypeBlock = StatPageDisplayTable[props.for]
  if (!statTypeBlock) throw Error("Invalid stat type for " + props.for)
  const data = useLoaderData()[props.for]
  const [filter, setFilter] = useState('')
  const [showOffcanvas, setshowOffcanvas] = useState(false)
  const [canvasContent, setCanvasContent] = useState({})

  const rowOnClick = (row) => {
    let flatObj = flattenObject(row)
    setCanvasContent(flatObj)
    setshowOffcanvas(true)
  }
  
  const flattenObject = (obj, result = {}, prefix = '') => {
    console.log(result)
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

  return (
    <div className="Stat">
      <h4>{statTypeBlock.title}</h4>
      Search <input value={filter} onChange={e => setFilter(e.target.value.toLowerCase())}></input>
      <hr/>
      <RSTable 
        tooltips={statTypeBlock.tooltips} 
        data={Object.values(data)} 
        filter={row => !filter || row.friendlyName.toLowerCase().includes(filter)} 
        columns={statTypeBlock.columns} 
        display={statTypeBlock.columnDisplay} 
        rowOnClick={rowOnClick.bind(this)}
      ></RSTable>
      <Offcanvas show={showOffcanvas} onHide={() => setshowOffcanvas(false)} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Details: {canvasContent.friendlyName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table>
            <tbody>
              {Object.entries(canvasContent).map(([key, val]) => (
                <tr>
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