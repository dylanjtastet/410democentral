import React from 'react';
import 'bulma/css/bulma.css';
import '../../general.css';
import Terminalbox from './terminal.jsx';
import Graphbox from './graphbox.jsx';
import Paraminput from './paraminput.jsx';
import {Controlled as CodeMirror} from 'react-codemirror2';

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

function Content(props) {
  const handleRunCode = function() {
      eval(props.code)
  }

  const getFunction = function() {
      let func = new Function("return " + props.code)();
      return func;
  }

  const getDataOneInputSize = async function(timed_func, start_size, end_size, num_steps) {
    let data = [];
    if ((typeof start_size)=="string") {
        start_size = parseInt(start_size);
    }
    let step_size = Math.floor((end_size-start_size)/num_steps)
    console.log(typeof start_size)
    console.log(end_size)
    console.log(num_steps)
    console.log(step_size)
    for (let i = start_size; i <= end_size; i += step_size) {
        let y = await timed_func(i);
        console.log(data)
        data.push({x: i, y: y});
    }
    return data;
  }

  const generateList = function(n) {
    let array = [];
    for (let i = 0; i < n; i++) {
        array.push(Math.floor(1000*Math.random()))
    }
    return array;
  }

  const passList = function(n) {
        let func = getFunction();
        let array = generateList(n);

        let start_time = Date.now();
        func(array);
        return Date.now() - start_time;
  }

  const getGraph = function() {
    if (props.input === "array") {
        return async (event) => {
            event.preventDefault();
            let data = await getDataOneInputSize(passList, props.parameters.start_size, props.parameters.end_size, props.parameters.num_steps);
            console.log(data)
            props.setGraph({show: true, data: data});
        }
    }
    if (props.input === "none") {
        return async (event) => {
            return;
        }
    }
  }


  return (
    <div className="container contentbox">
        <h1 className="subtitle">
            {props.name}
        </h1>

        <Paraminput input={props.input} setParameters={props.setParameters} parameters={props.parameters}></Paraminput>

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
        {/*<div className="container">
            Estimated Time Complexity: 
        </div>*/}
    </div>
  );
}

export default Content;
