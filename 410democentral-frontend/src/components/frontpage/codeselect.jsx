import React from 'react';

export default function Codeselect(props) {
    const handleClick = function(event) {
        event.preventDefault();
        props.setCode(props.program.code);
        props.setName(props.program.name);
        props.setId(props.program.id);
        props.setGraph({show: false, data: []})
    }

    let background;
    if (props.id==props.program.id) {
        background = "selected";
    } else {
        background = "";
    }

    return( 
        <li onClick={handleClick} className={background}><a>{props.program.name}</a></li>
    )
}