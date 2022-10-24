import './inputDropdown.css'

import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import React, { useState } from 'react';

const InputDropdown = (props) => {
  const [showDrop, setShowDrop] = useState(false)
  const [filter, setFilter] = useState(null)
  let parentRef = React.createRef()

  const focusHandler = e => {
    console.log('focus')
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

  const itemOnSelect = (item) => {
    console.log(item)
    setShowDrop(false)
    setFilter(null)
    if (props.handler) props.handler(item)
  }

  return (
    <div className="inputDropdown" ref={parentRef}  onBlur={blurHandler}>
      <Form.Control 
        type="search" 
        placeholder={props.placeholder || props.val} 
        value={(filter === null ? (props.val || '') : filter)} 
        onFocus={focusHandler} onChange={e => 
        setFilter(e.target.value)}
      />
      <ListGroup style={{display: (showDrop ? 'block' : 'none')}}>
        {
          props.items.map(item => (
            (!filter || item.toLowerCase().includes(filter.toLowerCase())) 
              ? <ListGroup.Item key={item} onClick={() => itemOnSelect(item)}><button className={(props.warnItem && props.warnItem(item)) ? 'danger' : 'normal'}>{item + (props.extraInfo ? ` (${props.extraInfo(item)})` : '')}</button></ListGroup.Item> 
              : null
          ))
        }
      </ListGroup>
    </div>
  )
}

export default InputDropdown