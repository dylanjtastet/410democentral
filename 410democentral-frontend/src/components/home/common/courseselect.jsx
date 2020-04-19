import React from 'react';
import 'bulma/css/bulma.css';

export default function Courseselect({group, setActiveGroup}) {
    const handleClick = function(event) {
        event.preventDefault();
        setActiveGroup(group);
    }

    return( 
        <a href="#coursebutton" className="dropdown-item" onClick={handleClick}>
            {group}
        </a>
    )
}
