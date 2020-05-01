import React from 'react';
import 'bulma/css/bulma.css';

export default function Courseselect({
    group,
    setActiveGroup,
    setActiveProgram,
    setOpened}) {
    const handleClick = function(event) {
        event.preventDefault();
        setActiveGroup(group);
        setActiveProgram("");
        setOpened(false);
    }

    return( 
        <a href="#coursebutton" className="dropdown-item" onClick={handleClick}>
            {
                (typeof(group)==="string") ?
                group
                :
                (group ? 
                group._id
                :
                ""
                )
             }
        </a>
    )
}
