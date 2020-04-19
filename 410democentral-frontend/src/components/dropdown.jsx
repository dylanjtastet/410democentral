import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';

import Courseselect from './courseselect.jsx';
import {
    fetchGroups,
    setActiveGroup
} from '../redux/actions/groupActions';

const Dropdown = ({fetchState, groups, activeGroup, fetchGroups, setActiveGroup}) => {
    useEffect(() => {
	   fetchGroups();
    }, []);

    groups = [...groups, "My Code"];

    const [opened, setOpened] = useState(false);
	const handleClick = function(event) {
		event.preventDefault();
		setOpened(!opened);
	}

	let insert = "";
	if (opened) {
		insert = "is-active"
	}
	
	return( 
		<div className={"dropdown " + insert + " courseselect is-right"}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={handleClick}>
				    <span>{activeGroup}</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
				</button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
				<div className="dropdown-content">
                    {groups.map(function(group, index) {
                        return <Courseselect key={index} group={group}
                            setActiveGroup={setActiveGroup} />
                    })}
                    <div className="dropdown-item pointer">
                        <span>Add a course </span>
                        <span className="icon is-small">
                            <i className="fas fa-plus" aria-hidden="true"></i>
                        </span>
                    </div>
				</div>
            </div>
		</div>
	)
}

const mapStateToProps = state => ({
    fetchState: state.groups.fetchState,
    groups: state.groups.groupNames,
    activeGroup: state.groups.activeGroup,
});

export default connect(mapStateToProps, {fetchGroups, setActiveGroup})(Dropdown);