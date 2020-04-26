import React, {useState} from 'react';
import {connect} from 'react-redux';

import 'bulma/css/bulma.css';
import 'bulma-slider/dist/css/bulma-slider.min.css'
import 'bulma-switch/dist/css/bulma-switch.min.css'

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {Controlled as CodeMirror} from 'react-codemirror2';

import '../../../general.css';
import ConsoleWrapper from './ConsoleWrapper.js'
import Graphbox from './graphbox.jsx';
import CodeSandbox from './CodeSandbox.js'
import ConstControlPanel from './ConstControlPanel.js'
import worker_script from "../../../scripts/eval_worker.js"
import WorkerWrapper from "../../../scripts/workerWrapper.js"
import CopySample from './CopySample';
import {
  fetchActiveProgram,
  pushCurrentLocalChanges,
  checkoutRemoteCode,
  addNewProgram,
  editCheckpoint,
  performEdit,
  finishEditing
} from '../../../redux/actions/programActions.js';

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

const evalWorker = new WorkerWrapper(worker_script);

function Content(props) {

  console.error(props.activeProgId);

  const graph = props.graph;
  const setGraph = props.setGraph;
  
  const [showCopyModal, setShowCopyModal] = useState(false);

  const [consoleBuffer, setConsoleBuffer] = useState([]);

  // log array for console feed
  const [logs, setLogs] = useState([]);

  // flag for code sandbox to indicate that code should be run
  const [pendingRun, setPendingRun] = useState(false);

  function sendRun(){
      evalWorker.postMessage({type: "EVAL_ALL", sample: props.program.localCode});
  }

  const handleEditToggle = (event, newState) => {
    if (newState === props.program.editState.editing) return;
    if (newState) {
      console.log("yeet");
      props.editCheckpoint();
    }
    else props.finishEditing();
  }

  //TODO: Clear content when activeGroup changes

  if (props.progFetchState.inProgress) {
    return (<div className="container contentbox">Loading program...</div>);
  } else if (props.progFetchState.error !== null) {
    return (
      <div className="container contentbox">
        Error loading program: {props.progFetchState.error.message}
      </div>);
  }

  return (
    <div className="container contentbox">
        {/*<CodeSandbox code={props.program.localCode} pendingRun={pendingRun} setPendingRun={setPendingRun} 
          setGraph={setGraph} setConsoleBuffer={setConsoleBuffer} />*/}

        {props.program.isEditable ?
        <ToggleButtonGroup value={props.program.editState.editing} 
            exclusive onChange={handleEditToggle}>
          <ToggleButton key={0} value={false}>View</ToggleButton>
          <ToggleButton key={1} value={true}>Edit</ToggleButton>
        </ToggleButtonGroup>

        :
        <span></span>
        }
        <a className="button is-info runbutton copybutton" onClick={() => {setShowCopyModal(true)}} href="#copybutton">
        Make a copy
        </a>

        {showCopyModal ?
        <CopySample name={props.program.name} code={props.program.localCode} 
          addNewProgram={props.addNewProgram} setShowCopyModal={setShowCopyModal}
          category={props.program.category} group={props.group} />
        : <span></span>
        }
        {props.program.editState.editing ?
        <CodeMirror
            value={props.program.localCode}
            options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                readOnly: false
            }}
            onBeforeChange={(editor, data, value) => {
              // commented out due to current implementation
              // need to revisit structure here
              props.performEdit(value);
            }}
            onChange={(editor, data, value) => {
            }}
        />
        :
        <CodeMirror
            value={props.program.remoteCode}
            options={{
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                readOnly: true
            }}
            onBeforeChange={(editor, data, value) => {
            }}
            onChange={(editor, data, value) => {
            }}
        />
        }

        <br>
        </br>
        <div className="container columns">
            <div className="column is-2">
                {/* This manages all of the webworker state. It aint pretty but it works */}
                <ConstControlPanel setConsoleBuffer = {setConsoleBuffer} code={props.program.localCode}
                  evalWorker = {evalWorker} setLogs = {setLogs} setGraph = {setGraph}/>
                <p>
                    <button className="button runbutton" 
                      onClick={props.fetchActiveProgram}>Reload</button>
                </p>
                <br></br>
                <p>
                    <button className="button runbutton" onClick={sendRun}>Run</button>
                </p>
            </div>
            <div className="column console">
                <ConsoleWrapper logs={logs} setLogs={setLogs} 
                  consoleBuffer={consoleBuffer} setConsoleBuffer={setConsoleBuffer} />
            </div>
        </div>

        {graph.show ?
        <div className="container columns">
              {
                /*
                <div className="column is-2"> 
                    <p>
                        <button className="button runbutton">Evaluate</button>
                    </p>
                </div>
                */
              }
                
                <div className="column">
                  <Graphbox data={graph.data} />
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


const mapStateToProps = state => ({
  group: state.groups.activeGroup,
  progFetchState: state.programs.fetchState,
  program: state.programs.progs[state.programs.activeProgId]
});

export default connect(mapStateToProps, {
  fetchActiveProgram,
  pushCurrentLocalChanges,
  addNewProgram,
  checkoutRemoteCode,
  editCheckpoint,
  performEdit,
  finishEditing
})(Content);
