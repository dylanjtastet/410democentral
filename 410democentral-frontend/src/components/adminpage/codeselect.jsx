import React from 'react';

import ReactDOM from "react-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

export default function Codeselect(props) {

    const handleCodeDelete = function(id) {
		return async () => {
            if (window.confirm("Are you sure you would like to delete " + props.name + "?")) {
                let sampleURL = new URL("http://localhost:3009/sample");

                //sampleURL.searchParams.append("id", id);

                let response = await fetch(sampleURL, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                },
                    
                    body: JSON.stringify({id: id})
                });
                await props.refreshCats();
            } else {
                return;
            }
		}
    }
    
    const handleCodeGet = function(id) {
        return async () => {
            props.setId(props.progID);
            props.setParent(props.parent);

            let sampleURL = new URL("http://localhost:3009/sample");
            sampleURL.searchParams.append("id", props.progID);

            await fetch(sampleURL)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              let code2="";
              if (data.code2 != null) code2=data.code2;
              props.setProgram({
                  "name": data.name,
                  "code": data.code,
                  "code2": code2
              })
            });
        }
    }

    let background;

    if (props.id === props.progID) {
        background = "selected";
    } else {
        background = "";
    }

    return( 
        <li>
            <ContextMenuTrigger id={props.progID}>
                <div onClick={handleCodeGet(props.progID)} className={background}><a href="#codeselect">{props.name}</a></div>
            </ContextMenuTrigger>

            <ContextMenu id={props.progID}>
                <MenuItem onClick={handleCodeDelete(props.progID)}>
                    <a className="box">Delete</a>
                </MenuItem>
            </ContextMenu>
        </li>
    )
}
