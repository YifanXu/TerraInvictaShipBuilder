import './ModifiableInputList.css'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputDropdown from './InputDropdown';

const ModifiableInputList = (props) => {
  let count = 0
  for (let item of props.val) {
    count += props.getCount(item)
  }

  const getCount = (val) => {
    return val.slotCount || 1
  }

  const setEntry = (slotNum, newVal, newVBody) => {
    let newArr = [...props.val]
    newArr[slotNum] = newVal
    props.handler(newArr)
  }

  const addEntry = (newVal, newValBody) => {
    props.handler([...props.val, newVal])
  }

  const removeEntry = (slotNum) => {
    let newArr = [...props.val]
    newArr.splice(slotNum, 1)
    props.handler(newArr)
  }

  const list = props.val.map((v, i) => (
    <Row key={i}>
      <Col className="col-11">
        <InputDropdown items={props.items} val={v} handler={(newV, newVBody) => setEntry(i, newV, newVBody)} filter={props.filter} filteralien={props.filteralien}/>
      </Col>
      <Button className="btn btn-danger col-1" onClick={() => removeEntry(i)}>X</Button>
    </Row>
  ))

  if (count < props.capacity) {
    list.push(
      <Row key='insertDropDown'>
        <Col className="col-11">
          <InputDropdown 
            className="col-11" 
            items={props.items} 
            val="" 
            placeholder="Add..." 
            handler={addEntry} 
            extraInfo={val => getCount(val)} 
            warnItem={val => getCount(val) > props.capacity - count} 
            filteralien={props.filteralien}
            filter={props.filter}
          />
        </Col>
      </Row>
    )
  }

  return (
    <Form.Group>
      <Form.Label>{props.title} <span className={`capacityDisplayLabel ${count > props.capacity ? 'danger' : (count < props.capacity ? 'warn' : 'success')}`}>[{count}/{props.capacity}]</span></Form.Label>
      {list}
    </Form.Group>
  )
}

export default ModifiableInputList