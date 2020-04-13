import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import {Controlled as CodeMirror} from 'react-codemirror2';

function CodeAdd(props) {
    const [cat, setCat] = useState("");
    const [newcat, setNewcat] = useState("")
    const [newparent, setNewparent] = useState("")
    const [code1, setCode1] = useState("")
    const [code2, setCode2] = useState("")
    const [codename, setCodename] = useState("")
    const [pasting, setPasting] = useState(false);
   
    let insert
    if (props.adding) {
        insert = "modal is-active"
    } else {
        insert = "modal"
    }

    const handleCancel = function(event) {
        props.setAdding(false);
    }

    const handleStartPaste = function() {
        setPasting(true);
    }

    const handleCancelPaste = function() {
        setPasting(false)
    }

    const handleCatSelect = function(event) {
        setCat(event.target.value);
    }

    const handleParentSelect = function(event) {
        setNewparent(event.target.value);
    }

    const handleCatChange = function(event) {
        event.preventDefault();
        setNewcat(event.target.value);
    }

    const handleCodeNameChange = function(event) {
        setCodename(event.target.value);
    }

    const handleAddCode = function(event) {
        return async () => {
            if (codename==="") return;
            let sample = {
                name: codename,
                code: code1,
                code2: code2,
            };

            let sampleURL = new URL("http://localhost:3009/sample");

            sampleURL.searchParams.append("category", cat);

            let response = await fetch(sampleURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  },
                body: JSON.stringify(sample)
            });
            console.log(response);
            await props.refreshcats();
            props.setAdding(false);
        }
    }

    const handleAddCat = function(event) {
        return async () => {
            if (newcat==="") return;
            let sampleURL = new URL("http://localhost:3009/category");
            sampleURL.searchParams.append("name", newcat);
            sampleURL.searchParams.append("parent", newparent);

            await fetch(sampleURL, {
                method:'POST'
            });
            await props.refreshcats();
            setCat(newcat)
            setNewcat("");
            setNewparent("");
            
        }
    }
  
    return (
        <div className={insert}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Add Code</p>
                    <button className="delete" aria-label="close" onClick={handleCancel}></button>
                </header>
                <section className="modal-card-body">
                    <div className="columns">                 
                        <div className="column is-one-third">
                            <label>Pick a category</label>
                            <div className="select">
                                <select value={cat} onChange={handleCatSelect}>
                                    <option value="">None selected</option>
                                    {props.cats.map(function(cat, index) {
                                        return <option value={cat._id} key={index}>{cat._id}</option>
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
                                    <button className="button is-info" onClick={handleAddCat()}>Add</button>
                                    }
                                </div>
                            </div>
                            <label>Parent category</label>
                            <div>    
                                <div className="select">
                                    <select value={newparent} onChange={handleParentSelect}>
                                        <option value="">None selected</option>
                                        {props.cats.map(function(cat, index) {
                                            return <option value={cat._id} key={index}>{cat._id}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottommargin">
                        <label className="paraminputs">Sample Name</label>  
                        <input className="input" type="text" placeholder="e.g. - Bubble Sort" value={codename} onChange={handleCodeNameChange}></input>
                    </div>

                    {pasting ?
                    <div>
                        <label className="paraminputs"> Code body</label>
                        <p className="is-size-7">Type in the visible part of the code sample here.</p>
                            <div className="bottommargin maincode paraminputs">
                                <CodeMirror
                                    value={code1}
                                    options={{
                                        mode: 'javascript',
                                        theme: 'neo',
                                        lineNumbers: true
                                    }}
                                    onBeforeChange={(editor, data, value) => {
                                    // commented out due to current implementation
                                    // need to revisit structure here
                                        setCode1(value);
                                    }}
                                    onChange={(editor, data, value) => {
                                    }}
                                />
                            </div>

                            <label>Benchmark (optional)</label>
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
                                <button className="button is-small" onClick={handleCancelPaste}>Return</button>
                            </div>
                        </div>
                        :
                        <div>
                            <div>Input Code</div>
                            <div className="columns centered">
                                <div className="column"></div>
                                <div className="column is-one-fourth">
                                    <button className="button is-info" onClick={handleStartPaste}>Paste</button>
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
                    <button className="button is-success" onClick={handleAddCode()}>Add Code</button>
                    <button className="button" onClick={handleCancel}>Cancel</button>
                </footer>
            </div>
        </div>
    );
}
  
  export default CodeAdd;