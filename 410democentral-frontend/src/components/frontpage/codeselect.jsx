import React from 'react';

export default function Codeselect(props) {
    const handleClick = function(event) {
        event.preventDefault();
        props.setCode(props.program.code);
        props.setName(props.program.name);
        props.setId(props.program.id);
        props.setInput(props.program.input);
        props.setGraph({show: false, data: []});

        if (props.program.input==="array") {
            props.setParameters({start_size: 50, end_size: 100000, num_steps: 20});
        } else {
            props.setParameters({});
        }

    }

    let background;
    if (props.id === props.program.id) {
        background = "selected";
    } else {
        background = "";
    }

    return( 
        <li onClick={handleClick} className={background}><a>{props.program.name}</a></li>
    )
}
