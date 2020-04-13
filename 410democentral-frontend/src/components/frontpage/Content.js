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

  return (
    <div className="container contentbox">
        <CodeSandbox code={program.code} pendingRun={pendingRun} setPendingRun={setPendingRun} 
          setGraph={props.setGraph} setConsoleBuffer={setConsoleBuffer} />

        <h1 className="subtitle">
            {program.name ? program.name : "No code selected"}
        </h1>

        

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
