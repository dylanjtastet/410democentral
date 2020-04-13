import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import CodeAdd from './CodeAdd';
import CodeEdit from './CodeEdit';

function CodeTab(props) {
    const [adding,setAdding] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleStartAdd = function(event) {
        setAdding(true);
    }

    const handleStartEdit = function(event) {
        return async () => {
            await props.refreshProgram()
            setEditing(true);
        }
    }


  
    return (
        <div>
            <div className="subtitle">Manage Code</div>
            <div>
                <span className="rightmargin">
                    <button className="button is-info" onClick={handleStartAdd}>Add Code</button>
                </span>
                <span>
                    {(props.id != "") ?
                    <button className="button" onClick={handleStartEdit()}>Edit Selected Code</button>
                    :
                    <button className="button is-static">Edit Selected Code</button>
                    }
                </span>
            </div>
            <CodeAdd adding={adding} setAdding={setAdding} cats={props.cats} refreshcats={props.refreshcats}/>
            <CodeEdit program={props.program} parent={props.parent} id={props.id} editing={editing} setEditing={setEditing} cats={props.cats} refreshcats={props.refreshcats}/>
            
        </div>
    );
}
  
  export default CodeTab;