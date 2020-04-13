import React, {useState} from 'react';
import 'bulma/css/bulma.css';

import Courseselect from './courseselect.jsx';

export default function Dropdown(props) {
    const [opened, setOpened] = useState(false);
    const handleClick = function(event) {
        event.preventDefault();
        opened ?
        setOpened(false) :
        setOpened(true)
    }

    let insert = "";
    if (opened) {
        insert = "is-active"
    }
    
    return( 
        <div className={"dropdown " + insert + " courseselect is-right"}>
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={handleClick}>
                  <span>{props.course}</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  {props.courses.map(function(course,index) {
                    return <Courseselect course={course} key={index} setCourse={props.setCourse}/>
                  })}
                  <div className="dropdown-item pointer">
                      <span>Add a course </span>
                      <span className="icon is-small">
                        <i className="fas fa-plus" aria-hidden="true"></i>
                      </span>
                  </div>
                </div>
              </div>
        </div>
    )
}