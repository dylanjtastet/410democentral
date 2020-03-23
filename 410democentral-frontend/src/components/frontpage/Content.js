import React from 'react';
import 'bulma/css/bulma.css';
import '../../general.css';
import Terminalbox from './terminal.jsx';
import Graphbox from './graphbox.jsx';

 


import {Controlled as CodeMirror} from 'react-codemirror2'
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

function Content(props) {
  return (
    <div className="container contentbox">
        <h1 className="subtitle">
            {props.name}
        </h1>
        <CodeMirror
            value={props.code}
            options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              props.setCode({value});
            }}
            onChange={(editor, data, value) => {
            }}
        />

        <br>
        </br>
        <div className="container columns">
            <div className="column is-2"> 
                <p>
                    <button className="button runbutton">Run</button>
                </p>
                <br></br>
                <p>
                    <button className="button runbutton">Graph</button>
                </p>
            </div>
            <div className="column">
                <Terminalbox />
            </div>
        </div>
        <div className="container columns">
            <div className="column is-2"> 
                <p>
                    <button className="button runbutton">Evaluate</button>
                </p>
            </div>
            {/*Hypothetical graph-- generated when graph button is pressed*/}
            <div className="column">
                <Graphbox />
            </div>
        </div>
        <br>
        </br>
        <div className="container">
            Estimated Time Complexity: 
        </div>
    </div>
  );
}

export default Content;