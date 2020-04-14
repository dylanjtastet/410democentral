import React, { useState } from 'react';
import Codeselect from './codeselect.jsx';

export default function Catselect(props) {
  const [opened, setOpened] = useState(props.startOpen);
  
  const handleClick = function(event) {
    event.preventDefault();
    setOpened(!opened);
  }
  
  return (
    <li>
    <a onClick={handleClick} href="#category">{props.cat.name}</a>
    {opened ?
      <ul>
        {props.cat.children.map((item, i) => {
          if (item.type === "category") {
            return (
              <Catselect cat={item} id={props.id} setId={props.setId} 
                setGraph={props.setGraph} startOpen={false} key={i} />
              )
          }
          else if (item.type === "sample") {
            return (
              <Codeselect id={props.id} setId={props.setId} setGraph={props.setGraph}
                progID={item._id} name={item.name} key={i} />
              )
          } else {
            return undefined; // could also do some error handling
          }
        })}
      </ul>
      :
      <span></span>
    }
    </li>
  )
}
