import React, { useState } from 'react';
import {connect} from 'react-redux';

import {
    addNewProgram,
    pushCurrentLocalChanges,
    editCheckpoint,
    performEdit,
    finishEditing
} from '../../../redux/actions/programActions';
import {
    createCategory
} from '../../../redux/actions/categoryActions';

import 'bulma/css/bulma.css';
import '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import {Controlled as CodeMirror} from 'react-codemirror2';

function CodeEdit({
    showCodeModal,
    setShowCodeModal,
    catIDs,
    cats,
    program,
    addNewProgram,
    pushCurrentLocalChanges,
    editCheckpoint,
    performEdit,
    finishEditing
}) {
    const [cat, setCat] = useState("");
    const [code2, setCode2] = useState("");
    const [newcat, setNewcat] = useState("");
    const [newparent, setNewparent] = useState("");


    let insert;
    if (showCodeModal) {
        insert = "modal is-active"
    } else {
        insert = "modal"
    }

    const handleCancel = event => {
        setShowCodeModal(false);
    }

    const handleStartEdit = () => {
        editCheckpoint();
    }

    const handleCancelEdit = () => {
        finishEditing();
    }

    const handleCatSelect = event => {
        setCat(event.target.value);
    }

    const handleParentSelect = event => {
        setNewparent(event.target.value);
    }

    const handleCatChange = event => {
        event.preventDefault()
        setNewcat(event.target.value);
    }

    const handleCodeNameChange = function(event) {
        console.log("rename program action not yet implemented.");
    }


    const handleAddCode = event => {
        if (program._id == "") addNewProgram(program, cat, true);
        else {
            pushCurrentLocalChanges();
            finishEditing();
        }
    }

    const handleAddCat = function(event) {
        // TODO add logic to check for result of createCategory
        createCategory(newcat, newparent, "dummy group");
        setCat(newcat);
        setNewcat("");
        setNewparent("");
    }
  
    return (
        <div className={insert}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Edit Code</p>
                    <button className="delete" aria-label="close" onClick={handleCancel}></button>
                </header>
                <section className="modal-card-body">
                    <label className="subtitle paraminputs">Set Category</label>
                    <div className="columns">                 
                        <div className="column is-one-third">
                            <label>Pick a category</label>
                            <div className="select">
                                <select value={cat} onChange={handleCatSelect}>
                                    <option value="">None selected</option>
                                    {catIDs.map((catID, index) => {
                                        return <option value={catID} key={index}>{cats[catID].name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="is-divider-vertical" data-content="OR"></div>
                        <div className="column">
                            <label>Create new category</label>
                            <div className="field has-addons">    
                                <div className="control">
                                    <input className="input" type="text" placeholder="e.g. - Sorting" value={newcat} onChange={handleCatChange}></input>
                                </div>
                                <div className="control">
                                    {(newcat === "") ?
                                    <button className="button is-info is-static">Add</button>
                                    :
                                    <button className="button is-info" onClick={handleAddCat}>Add</button>
                                    }
                                </div>
                            </div>
                            <label>Parent category</label>
                            <div>    
                                <div className="select">
                                    <select value={newparent} onChange={handleParentSelect}>
                                        <option value="">None selected</option>
                                        {catIDs.map((catID, index) => {
                                            return <option value={catID} key={index}>{cats[catID].name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottommargin">
                        <label className="subtitle paraminputs">Sample Name</label>  
                        <input className="input" type="text" placeholder="e.g. - Bubble Sort" value={program.name} onChange={handleCodeNameChange}></input>
                    </div>

                    {program.editState.editing ?
                    <div>
                        <label className="subtitle paraminputs"> Code body</label>
                        <p>Type in the visible part of the code sample here.</p>
                            <div className="bottommargin maincode paraminputs">
                                <CodeMirror
                                    value={program.localCode}
                                    options={{
                                        mode: 'javascript',
                                        theme: 'neo',
                                        lineNumbers: true
                                    }}
                                    onBeforeChange={(editor, data, value) => {
                                    // commented out due to current implementation
                                    // need to revisit structure here
                                        performEdit(value);
                                    }}
                                    onChange={(editor, data, value) => {
                                    }}
                                />
                            </div>

                            <label className="subtitle">Benchmark (optional)</label>
                            <div className="bottommargin benchcode paraminputs">
                                <CodeMirror
                                    value={code2}
                                    options={{
                                        mode: 'javascript',
                                        theme: 'neo',
                                        lineNumbers: true
                                    }}
                                    onBeforeChange={(editor, data, value) => {
                                    // commented out due to current implementation
                                    // need to revisit structure here
                                        setCode2(value);
                                    }}
                                    onChange={(editor, data, value) => {
                                    }}
                                />
                            </div>
                            <div>
                                <button className="button is-small" onClick={finishEditing}>Return</button>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="subtitle">Input Code</div>
                            <div className="columns centered">
                                <div className="column"></div>
                                <div className="column is-one-fourth">
                                    <button className="button is-info" onClick={editCheckpoint}>Paste</button>
                                </div>
                                <div className="is-divider-vertical" data-content="OR"></div>
                                <div className="column is-one-third">
                                    <div className="file">
                                        <label className="file-label">
                                            <input className="file-input" type="file" name="resume"/>
                                            <span className="file-cta">
                                            <span className="file-icon">
                                                <i className="fas fa-upload"></i>
                                            </span>
                                            <span className="file-label">
                                                Choose a file…
                                            </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="column"></div>
                            </div>
                        </div>  
                    }


                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={handleAddCode}>Save Code</button>
                    <button className="button" onClick={handleCancel}>Cancel</button>
                </footer>
            </div>
        </div>
    );
}


const mapStateToProps = state => ({
    catIDs: state.categories.catIDs,
    cats: state.categories.cats,
    program: state.programs.progs[state.programs.activeProgId]
});

export default connect(mapStateToProps, {
    addNewProgram,
    pushCurrentLocalChanges,
    editCheckpoint,
    performEdit,
    finishEditing
})(CodeEdit);
