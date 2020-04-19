import React from 'react';
import {connect} from 'react-redux';
import {fetchProgram, deleteProgram, setActiveProgram} from '../redux/actions/programActions';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const Codeselect = ({
    progID,
    progName,
    isAdmin,
    setGraph,
    parent,
    activeProgId,
    fetchProgram,
    deleteProgram,
    setActiveProgram
}) => {

    let background;
    if (progID === activeProgId) {
        background = "selected";
    } else {
        background = "";
    }

    const handleCodeGet = event => {
        event.preventDefault();
        // If equality check isn't performed first, infinite
        // re-render occurs. I'm not sure why.
        if (progID !== activeProgId) {
            fetchProgram(progID);
            setActiveProgram(progID);
        }
        //setGraph({show: false, data: []});
    }

    const handleCodeDelete = event => {
        if (window.confirm("Are you sure you would like to delete " + progName + "?")) {
            event.preventDefault();
            deleteProgram(progID);
        }
    }


    return (
        isAdmin ?
            <li>
                <ContextMenuTrigger id={progID}>
                    <div onClick={handleCodeGet} className={background}><a href="#codeselect">{progName}</a></div>
                </ContextMenuTrigger>

                <ContextMenu id={progID}>
                    <MenuItem onClick={handleCodeDelete}>
                        <a href="#deletebutton" className="box">Delete</a>
                    </MenuItem>
                </ContextMenu>
            </li>
            :
            <li onClick={handleCodeGet} className={background}><a href="#codeselect">{progName}</a></li>
    )
}

const mapStateToProps = state => ({
    activeProgId: state.programs.activeProgId
});

export default connect(mapStateToProps, {
    fetchProgram,
    deleteProgram,
    setActiveProgram
})(Codeselect);