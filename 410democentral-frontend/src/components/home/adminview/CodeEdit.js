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
    createCategory, fetchCategories
} from '../../../redux/actions/categoryActions';

import {
    getCategoriesForActiveGroup
} from '../../../redux/selectors/categorySelectors';

import 'bulma/css/bulma.css';
import '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import {Controlled as CodeMirror} from 'react-codemirror2';

function CodeEdit({
    showCodeModal,
    setShowCodeModal,
    cats,
    activeProgId,
    program,
    group,
    createCategory,
    fetchCategories,
    addNewProgram,
    pushCurrentLocalChanges,
    editCheckpoint,
    performEdit,
    finishEditing
}) {

    let isNewProgram = activeProgId === "";

    /* Local state for storing input from the form prior to submission */

    const [name, setName] = useState(isNewProgram ? "" : program.name);
    const [cat, setCat] = useState(isNewProgram ? "" : program.category);

    // Just to be safe, explicitly check for hiddenCode for now (don't want 
    // to introduce regressions)
    let initHiddenCode = "";
    if (!isNewProgram && "hiddenCode" in program) {
        initHiddenCode = program.hiddenCode;
    }
    const [hiddenCode, setHiddenCode] = useState(initHiddenCode);
    
    const [newcat, setNewcat] = useState("");
    const [newparent, setNewparent] = useState("");
    const [fileName, setFileName] = useState("");


    let insert;
    if (showCodeModal) {
        insert = "modal is-active"
    } else {
        insert = "modal"
    }

    const handleCancel = event => {
        setShowCodeModal(false);
    }

    // eslint-disable-next-line no-unused-vars
    const handleStartEdit = () => {
        editCheckpoint();
    }

    // eslint-disable-next-line no-unused-vars
    const handleCancelEdit = () => {
        finishEditing();
    }

    const handleCatSelect = event => {
        setCat(event.target.value);
    }

    const handleFileSelect = async (event) => {
        setFileName(event.target.value);
        let flist = event.target.files;
        let code = await flist.item(0).text();
        if(flist.length > 0){
            performEdit(code);
        }
    }

    const handleNewCatChange = event => {
        event.preventDefault()
        setNewcat(event.target.value);
    }

    const handleParentSelect = event => {
        setNewparent(event.target.value);
    }

    const handleCodeNameChange = function(event) {
        setName(event.target.value);
    }

    const handleSaveChanges = event => {
        if (name === "" || cat === "") {
            window.alert("Must select category and non-empty program name.");
            return;
        }
        if (isNewProgram) {
            addNewProgram(
                {name: name, code: program.localCode},
                cat, group, false, true);
        }
        else {
            pushCurrentLocalChanges(
                cat, // category ID
                group, // group ID (i.e. name, currently)
                { // program updates (in addition to local code) to go in req body
                    name: name,
                    hiddenCode: hiddenCode
                }
            );
            finishEditing();
            fetchCategories();
        }
        setShowCodeModal(false);
    }

    const handleAddCat = event => {
        // TODO add logic to check for result of createCategory
        if (newcat === "") {
            window.alert("Cannot create category with empty name.");
            return;
        }
        if (newparent === "") {
            setNewparent(null);
        }        
        createCategory(newcat, newparent, group);
        // todo: get newID back from createCategory so that we can set
        // setCat to newID (currently this doesn't work)
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
                                    {cats.map((cat, index) => {
                                        return <option value={cat.id} key={index}>{cat.name}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="is-divider-vertical" data-content="OR"></div>
                        <div className="column">
                            <label>Create new category</label>
                            <div className="field has-addons">    
                                <div className="control">
                                    <input className="input" type="text" placeholder="e.g. - Sorting" value={newcat} onChange={handleNewCatChange}></input>
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
                                        {cats.map((cat, index) => {
                                            return <option value={cat.id} key={index}>{cat.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottommargin">
                        <label className="subtitle paraminputs">Sample Name</label>  
                        {isNewProgram ?
                        <input className="input" type="text" placeholder="e.g. - Bubble Sort" onChange={handleCodeNameChange}></input>
                        :
                        <input className="input" type="text" value={name} onChange={handleCodeNameChange}></input>
                        }
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
                                        performEdit(value);
                                    }}
                                    onChange={(editor, data, value) => {
                                    }}
                                />
                            </div>

                            <label className="subtitle">Benchmark (optional)</label>
                            <div className="bottommargin benchcode paraminputs">
                                <CodeMirror
                                    value={hiddenCode}
                                    options={{
                                        mode: 'javascript',
                                        theme: 'neo',
                                        lineNumbers: true
                                    }}
                                    onBeforeChange={(editor, data, value) => {
                                        setHiddenCode(value);
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
                                            <input className="file-input" type="file" name="codeFile" onChange={handleFileSelect} multiple={false}/>
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
                                    <span>{fileName}</span>
                                </div>
                                <div className="column"></div>
                            </div>
                        </div>  
                    }


                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={handleSaveChanges}>Save Changes</button>
                    <button className="button" onClick={handleCancel}>Cancel</button>
                </footer>
            </div>
        </div>
    );
}


const mapStateToProps = state => ({
    cats: getCategoriesForActiveGroup(state),
    activeProgId: state.programs.activeProgId,
    program: state.programs.progs[state.programs.activeProgId],
    group: state.groups.activeGroup
});

export default connect(mapStateToProps, {
    createCategory,
    fetchCategories,
    addNewProgram,
    pushCurrentLocalChanges,
    editCheckpoint,
    performEdit,
    finishEditing
})(CodeEdit);
