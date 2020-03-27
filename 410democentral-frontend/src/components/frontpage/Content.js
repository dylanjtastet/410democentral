import React from 'react';
import 'bulma/css/bulma.css';
import '../../general.css';
import Terminalbox from './terminal.jsx';
import Graphbox from './graphbox.jsx';
import {Controlled as CodeMirror} from 'react-codemirror2'
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

const graph_data = [
  { x: 10, y: 12.16 },
  { x: 30, y: 94.29 },
  { x: 50, y: 254.17 },
  { x: 70, y: 493.88 },
  { x: 100, y: 1002.31 },
];

function Content(props) {
  const addFunc = function(num1, num2) {
      console.log(num1 + num2)
  }
  const handleRunCode = function() {
      console.log(eval(props.code))
  }

  const getData = async function() {
    return graph_data;
  }

  const getGraph = function(event) {
    return async (event) => {
        event.preventDefault();
        let data = await getData();
        props.setGraph({show: true, data: data});
    }
  }

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
              props.setCode(value);
            }}
            onChange={(editor, data, value) => {
            }}
        />

        <br>
        </br>
        <div className="container columns">
            <div className="column is-2"> 
                <p>
                    <button className="button runbutton" onClick={handleRunCode}>Run</button>
                </p>
                <br></br>
                <p>
                    <button className="button runbutton" onClick={getGraph()}>Graph</button>
                </p>
            </div>
            <div className="column">
                <Terminalbox />
            </div>
        </div>

        {props.graph.show ?
        <div className="container columns">
                <div className="column is-2"> 
                    <p>
                        <button className="button runbutton">Evaluate</button>
                    </p>
                </div>
                
                <div className="column">
                    <Graphbox data={props.graph.data} />
                </div>
        </div>
        :
        <span></span>
        }
        <br>
        </br>
        <div className="container">
            Estimated Time Complexity: 
        </div>
    </div>
  );
}

export default Content;
