import React, { useState } from 'react';
import Codeselect from './codeselect.jsx';

export default function Catselect(props) {
    const [opened, setOpened] = useState(true);
    const handleClick = function(event) {
        event.preventDefault();
        setOpened(!opened);
        
    }
    return( 
        <li key={props.j}>
            <a onClick={handleClick}>{props.subcat.subcat}</a>
            {opened ?
                <ul>
                    {props.subcat.programs.map((program,k) => {
                        return(<Codeselect program={program} setCode={props.setCode} setName={props.setName} key={[props.i,props.j,k]}/>)
                    })}
                </ul>
                :
                <span></span>
            }
        </li>
    )
}