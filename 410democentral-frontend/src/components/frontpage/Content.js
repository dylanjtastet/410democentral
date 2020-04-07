import React, {useState} from 'react';
import 'bulma/css/bulma.css';
import '../../general.css';
import ConsoleWrapper from './ConsoleWrapper.js'
import Graphbox from './graphbox.jsx';
import Paraminput from './paraminput.jsx';
import CodeSandbox from './CodeSandbox.js'
import {Controlled as CodeMirror} from 'react-codemirror2';

import useCode from './useCode';

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

function Content(props) {
  
  const [consoleBuffer, setConsoleBuffer] = useState([]);

  // log array for console feed
  const [logs, setLogs] = useState([]);

  // flag for code sandbox to indicate that code should be run
  const [pendingRun, setPendingRun] = useState(false);

  const program = useCode(props.id);

  { //Below are the functions associated with the old version of graphing.
      /*

  const getFunction = function() {
      let func = new Function("return " + program.code)();
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
    if (program.input === "array") {
        return async (event) => {
            event.preventDefault();
            let data = await getDataOneInputSize(
              passList, program.parameters.start_size, 
              program.parameters.end_size, program.parameters.num_steps);
            console.log(data)
            props.setGraph({show: true, data: data});
        }
    }
    if (program.input === "none" || program.input === "") {
        return async (event) => {
            return;
        }
    }
  }
  */}


  return (
    <div className="container contentbox">
        <h1 className="subtitle">
            {program.name}
        </h1>

        <CodeSandbox code={program.code} pendingRun={pendingRun} setPendingRun={setPendingRun} 
          setGraph={props.setGraph} setConsoleBuffer={setConsoleBuffer} />

        <Paraminput input={program.input} setParameters={program.setParameters} parameters={program.parameters}></Paraminput>

        <CodeMirror
            value={program.code}
            options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true
            }}
            onBeforeChange={(editor, data, value) => {
              // commented out due to current implementation
              // need to revisit structure here
              program.setCode(value);
            }}
            onChange={(editor, data, value) => {
            }}
        />

        <br>
        </br>
        <div className="container columns">
            <div className="column is-2"> 
                <p>
                    <button className="button runbutton" onClick={program.pullFromServer}>Reload</button>
                </p>
                <br></br>
                <p>
                    <button className="button runbutton" onClick={() => {setPendingRun(true)}}>Run</button>
                </p>
                <br></br>
                {/*
                <p>
                    <button className="button runbutton" onClick={getGraph()}>Graph</button>
                </p>
                */
                }
            </div>
            <div className="column console">
                <ConsoleWrapper logs={logs} setLogs={setLogs} 
                  consoleBuffer={consoleBuffer} setConsoleBuffer={setConsoleBuffer} />
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