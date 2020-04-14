import React from 'react';
import 'bulma/css/bulma.css';

export default function Courseselect(props) {
    const handleClick = function(event) {
        event.preventDefault();
        props.setCourse(props.course);
    }

    return( 
        <a href="#coursebutton" className="dropdown-item" onClick={handleClick}>
            {props.course}
        </a>
    )
}
