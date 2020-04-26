import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';

import Courseselect from './courseselect.jsx';
import Courseadd from './courseadd.jsx';
import {
    fetchGroups,
    setActiveGroup
} from '../../redux/actions/groupActions';

const Dropdown = ({fetchState, groups, activeGroup, fetchGroups, setActiveGroup}) => {
    useEffect(() => {
	   fetchGroups();
       setActiveGroup("")
    }, [fetchGroups, setActiveGroup]);

    const [opened, setOpened] = useState(false);
    const [showCourseAdd, setShowCourseAdd] = useState(false);

	const handleClick = event => {
		event.preventDefault();
		setOpened(!opened);
    }
    
    const handleShowAddCourse = event => {
        event.preventDefault();
        setShowCourseAdd(true);
        setOpened(false)
    }


	let insert = "";
	if (opened) {
		insert = "is-active"
	}
	
	return( 
		<div className={"dropdown " + insert}>
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
                                setActiveGroup={setActiveGroup} setOpened={setOpened}/>
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
            <Courseadd setShowCourseAdd={setShowCourseAdd}/>
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

export default connect(mapStateToProps, {fetchGroups, setActiveGroup})(Dropdown);
