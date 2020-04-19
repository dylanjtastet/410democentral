import React, { useState } from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';
import '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import {setActiveProgram} from '../../../redux/actions/programActions';

import CodeEdit from './CodeEdit';

function CodeTab({activeProgId, setActiveProgram}) {
    const [showCodeModal, setShowCodeModal] = useState(false);

    const handleStartAdd = () => {
        if (activeProgId != "") {
<<<<<<< HEAD:410democentral-frontend/src/components/adminpage/CodeTab.js
            setActiveProgram("");    
=======
            setActiveProgram("");
>>>>>>> d6e40d2e15357d38e5730a1428b349ca5f07e632:410democentral-frontend/src/components/home/adminview/CodeTab.js
        }
        setShowCodeModal(true);
    }

    return (
        <div>
            <div className="subtitle">Manage Code</div>
            <div>
                <span className="rightmargin">
                    <button className="button is-info" onClick={handleStartAdd}>Add Code</button>
                </span>
                <span>
                    {(activeProgId != "") ?
                    <button className="button" onClick={() => setShowCodeModal(true)}>Edit Selected Code</button>
                    :
                    <button className="button is-static">Edit Selected Code</button>
                    }
                </span>
            </div>
            {showCodeModal ?
                <CodeEdit showCodeModal={showCodeModal} setShowCodeModal={setShowCodeModal} />
                :
                <span></span>
            }
            
        </div>
    );
}

const mapStateToProps = state => ({
    progFetchState: state.programs.fetchState,
    activeProgId: state.programs.activeProgId
}); 

export default connect(mapStateToProps, {setActiveProgram})(CodeTab);
