import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';

import Courseselect from './courseselect.jsx';
import Courseadd from './courseadd.jsx';
import {
    fetchGroups,
    setActiveGroup,
    fetchGroupNames
} from '../../redux/actions/groupActions';

import { setActiveProgram } from '../../redux/actions/programActions';

const Dropdown = ({
    fetchState,
    groups,
    activeGroup,
    fetchGroups,
    setActiveGroup,
    setActiveProgram
}) => {
    useEffect(() => {
	   fetchGroups();
       setActiveGroup("");
       document.addEventListener("mousedown", handleClickOff);
    // return function to be called when unmounted
       return () => {
           document.removeEventListener("mousedown", handleClickOff);
       };
    }, [fetchGroups, setActiveGroup]);

    const [opened, setOpened] = useState(false);
    const [showCourseAdd, setShowCourseAdd] = useState(false);
    const [courseNames, setCourseNames] = useState([]);

    const node = useRef();

	const handleClick = event => {
		event.preventDefault();
        setOpened(!opened);
    }

    const handleClickOff = event => {
        if (node.current.contains(event.target)) {
            return;
        }

        setOpened(false)
    }
    
    const handleShowAddCourse = async event => {
        event.preventDefault();

        let groupnames = await fetchGroupNames();
        let groupstojoin = [];
        for (let group of groupnames) {
            if (!group.inGroup) {
                groupstojoin.push(group);
            }
        }

        setCourseNames(groupstojoin);
        setShowCourseAdd(true);
        setOpened(false)
    }


	let insert = "";
	if (opened) {
		insert = "is-active"
	}
	
	return( 
		<div className={"dropdown " + insert} ref={node}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={handleClick}>
                    <span>{
                        (typeof(activeGroup)==="string") ?
                        activeGroup
                        :
                        activeGroup._id
                    }</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
				</button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
				<div className="dropdown-content">
                    {groups.map(function(group, index) {
                        return (
                            (group) ?
                            <Courseselect key={index} group={group}
                                setActiveGroup={setActiveGroup} setOpened={setOpened}
                                setActiveProgram={setActiveProgram}
                                />
                            :
                            <span></span>
                        )
                        
                        
                    })}

                    <a className="dropdown-item pointer" onClick={handleShowAddCourse} href="#dropdown-join-course">
                        <span>Join a course </span>
                        <span className="icon is-small">
                            <i className="fas fa-plus" aria-hidden="true"></i>
                        </span>
                    </a>
				</div>
            </div>
            {showCourseAdd ?
            <Courseadd setShowCourseAdd={setShowCourseAdd} courseNames={courseNames}/>
            :
            <span></span>
            }

		</div>
	)
}

const mapStateToProps = state => ({
    fetchState: state.groups.fetchState,
    groups: state.groups.groupNames,
    activeGroup: state.groups.activeGroup,
});

export default connect(mapStateToProps, {
    fetchGroups,
    setActiveGroup,
    setActiveProgram
})(Dropdown);
