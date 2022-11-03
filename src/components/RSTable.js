import './RSTable.css'
import { useState } from 'react'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import round from '../data/round';

const RSTable = props => {
  const columns = props.columns
  let tempData = props.data

  let [data, setData] = useState(tempData)
  let [filterBy, setFilterBy] = useState (null)
  let [ascending, setAscending] = useState (true)

  const body = data.map((dataRow, index) => (
    (props.filter && !props.filter(dataRow)) ? null : 
    <tr key={index} onClick={() => {if(props.rowOnClick) props.rowOnClick(dataRow)}}>
      {columns.map(column => <td key={column} style={props.highlight ? props.highlight(dataRow, column) : {}}>{dataRow[column] === undefined ? "" : ((props.transform && props.transform[column] ?  props.transform[column](dataRow[column]) : typeof dataRow[column] === 'number' ? round(dataRow[column]) : dataRow[column]))}</td>)}
    </tr>
  ))

  const setSort = (column) => {
    if (props.transform[column]) return;
    if (filterBy === column) {
      // Just reverse ascend/descend
      setData([...data].reverse())
      setAscending(!ascending)
    }
    else {
      setData([...data].sort((a,b) => isNaN(a[column]) ? a[column].localeCompare(b[column]) : a[column] - b[column]))
      setFilterBy(column)
      setAscending(true)
    }
  }

  return (
    <Table striped bordered hover size="sm" className={props.className}>
      <thead>
        <tr>
          {columns.map((column,i) => {
            const displayText = (props.display ? props.display[i] : column) + (filterBy === column ? (ascending ? '▲' : '▼') : '')
            if (props.tooltips) {
              return (
                <OverlayTrigger
                  key={column}
                  placement="bottom"
                  delay={{show: 500, hide: 0}}
                  overlay={<Tooltip id="button-tooltip">{props.tooltips[i]}</Tooltip>}
                >
                  {
                    ({ref, ...triggerHandler}) => (
                      <td ref={ref} onClick={() => setSort(column)} {...triggerHandler}>{displayText}</td>
                    )
                  }
                </OverlayTrigger> 
              )
            }
            return <td key={column} onClick={() => setSort(column)}>{displayText}</td>
          })}
        </tr>
      </thead>
      <tbody>
        {body}
      </tbody>
    </Table>
  )
}

export default RSTable