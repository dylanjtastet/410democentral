import React from 'react';

export default function Codeselect(props) {
    const handleClick = function(event) {
        event.preventDefault();
        props.setCode(props.program.code);
        props.setName(props.program.name);
    }
    return( 
        <li onClick={handleClick}><a >{props.program.name}</a></li>
    )
}