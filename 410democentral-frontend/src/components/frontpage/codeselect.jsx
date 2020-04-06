import React from 'react';

export default function Codeselect(props) {

    let background;

    if (props.id === props.progID) {
        background = "selected";
    } else {
        background = "";
    }

    const handleClick = function(event) {
        event.preventDefault();
        props.setId(props.progID);
        props.setGraph({show: false, data: []});
    }

    return( 
        <li onClick={handleClick} className={background}><a href="#codeselect">{props.name}</a></li>
    )
}
