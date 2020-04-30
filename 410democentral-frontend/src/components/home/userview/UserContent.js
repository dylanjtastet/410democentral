import React, {useState, useRef} from 'react';
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

  /* Local state (react hooks) */
  const graph = props.graph;
  const setGraph = props.setGraph;
  
  const [showCopyModal, setShowCopyModal] = useState(false);

  const [consoleRerenderHook, setConsoleRerenderHook] = useState();

  // log array for console feed
  const [logs, setLogs] = useState([]);

  const consoleBuffer = useRef([]);

  // iframe specific (uncomment for iframes)
  /*
  // flag for code sandbox to indicate that code should be run
  const [pendingRun, setPendingRun] = useState(false);
  */

  /* Early short-circuit returns */
  // Some early short-circuits to avoid further issues if/when state isn't defined
  
  // Might be commented out loading state bc leads to flickers every time a new program, group, etc is loaded
  // Can uncomment if any issues arise, or (in the far future) have a nice UI loading indicator
  
  if (props.progFetchState.inProgress) {
    return (<div className="container contentbox">Loading program...</div>);
  }
  if (props.progFetchState.error !== null) {
    return (
      <div className="container contentbox">
        Error loading program: {props.progFetchState.error.message}
      </div>);
  }

  /* Other local declarations */

  // Some convenient local decls derived from redux state
  let editing = props.program.editState.editing;
  let canPushEdits = props.program.isEditable;
  let code;
  if (editing) {
    code = props.program.localCode;
  } else {
    code = props.program.remoteCode;
  }

  let codeMirrorOptions = {
    mode: 'javascript',
    theme: 'material',
    lineNumbers: true,
    readOnly: !editing
  }
  
  /* Event Handlers */

  function sendRun(){
    let fullCode = code;
    if ("hiddenCode" in props.program) {
      fullCode += "\n" + props.program.hiddenCode;
    }
    evalWorker.postMessage({type: "EVAL_ALL", sample: fullCode});
  }

  const handleEditToggle = (event, newState) => {
    if (newState === editing) return;
    if (newState) {
      props.editCheckpoint();
    }
    else props.finishEditing();
  }

  const saveChanges = (event) => {
    props.pushCurrentLocalChanges();
  }

  /* Main logic */

  //TODO: Clear content when activeGroup changes



  return (
    <div className="container contentbox">
        {/*<CodeSandbox code={props.program.localCode} pendingRun={pendingRun} setPendingRun={setPendingRun} 
          setGraph={setGraph} setConsoleBuffer={setConsoleBuffer} />*/}

        <ToggleButtonGroup value={editing} 
            exclusive onChange={handleEditToggle}>
          <ToggleButton key={0} value={false}>View</ToggleButton>
          <ToggleButton key={1} value={true}>
            {canPushEdits ? 'Edit' : 'Edit Locally'}
          </ToggleButton>
        </ToggleButtonGroup>
        
        {editing && canPushEdits &&
          <a className="button is-info savechangesbutton copybutton" onClick={saveChanges} href="#savechangesbutton">
            Save local changes
          </a>
        }

        <a className="button is-info runbutton copybutton" onClick={() => {setShowCopyModal(true)}} href="#copybutton">
          Make a copy
        </a>

        {showCopyModal &&
        <CopySample name={props.program.name} code={code} 
          addNewProgram={props.addNewProgram} setShowCopyModal={setShowCopyModal}
          category={props.program.category} group={props.group} />
        }
        
        <CodeMirror
            value={code}
            options={codeMirrorOptions}
            onBeforeChange={(editor, data, value) => {
              if (editing) {
                // commented out due to current implementation
                // need to revisit structure here
                props.performEdit(value);
              } else {
                console.error("CodeMirror change attempted while not in edit mode.");
              }
            }}
            onChange={(editor, data, value) => {
            }}
        />

        <br>
        </br>
        
        {editing && !canPushEdits &&
          <>
          <div>
            Note: You are editing a sample which you do not have permission to change.
            To store your changes, click <b>Make a Copy</b> to the right.
          </div>
          <br></br>
          </>
        }

        <div className="container columns">
            <div className="column is-2">
                {/* This manages all of the webworker state. It aint pretty but it works */}
                <ConstControlPanel code={code} setConsoleRerenderHook = {setConsoleRerenderHook}
                  evalWorker = {evalWorker} setLogs = {setLogs} setGraph = {setGraph} consoleBuffer = {consoleBuffer}/>
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
                <ConsoleWrapper logs={logs} setLogs={setLogs} consoleRerenderHook = {consoleRerenderHook} consoleBuffer = {consoleBuffer}/>
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
