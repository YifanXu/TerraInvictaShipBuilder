import './inputDropdown.css'

import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState } from 'react';

const InputDropdown = (props) => {
  const [showDrop, setShowDrop] = useState(false)
  const [filter, setFilter] = useState(null)
  let parentRef = React.createRef()

  const focusHandler = e => {
    setShowDrop(true)
    setFilter('')
  }

  const blurHandler = (e) => {
    requestAnimationFrame(() => {
      if (parentRef.current && !parentRef.current.contains(document.activeElement)) {
        setShowDrop(false)
        setFilter(null)
      }
    });
  }

  const itemOnSelect = (item, itemVal) => {
    setShowDrop(false)
    setFilter(null)
    if (props.handler) props.handler(item, itemVal)
  }

  return (
    <div className="inputDropdown" ref={parentRef}  onBlur={blurHandler}>
      <Form.Control 
        type="search" 
        placeholder={props.placeholder || props.val} 
        value={(filter === null ? (props.val || '') : filter)} 
        onFocus={focusHandler} 
        onChange={e => setFilter(e.target.value)}
        disabled={props.disabled}
      />
      <ListGroup style={{display: (showDrop ? 'block' : 'none')}}>
        {
          Object.entries(props.items).map(([item, itemVal]) => (
            (!filter || item.toLowerCase().includes(filter.toLowerCase())) && (!props.filter || props.filter(itemVal)) && (props.showalien || itemVal.sumCost !== -1)
              ? <ListGroup.Item key={item} onClick={() => itemOnSelect(item, itemVal)}><button className={(props.warnItem && props.warnItem(itemVal)) ? 'danger' : 'normal'}>{item + (props.extraInfo ? ` (${props.extraInfo(item)})` : '')}</button></ListGroup.Item> 
              : null
          ))
        }
      </ListGroup>
    </div>
  )
}

export default InputDropdown