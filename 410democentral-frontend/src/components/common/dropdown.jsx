import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';

import Courseselect from './courseselect.jsx';
import {
    fetchGroups,
    setActiveGroup
} from '../../redux/actions/groupActions';

const Dropdown = ({fetchState, groups, activeGroup, fetchGroups, setActiveGroup}) => {
    useEffect(() => {
	   fetchGroups();
       setActiveGroup("")
    }, []);

    const [opened, setOpened] = useState(false);
	const handleClick = event => {
		event.preventDefault();
		setOpened(!opened);
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
                        return <Courseselect key={index} group={group}
                            setActiveGroup={setActiveGroup} setOpened={setOpened}/>
                    })}

                    <a className="dropdown-item pointer">
                        <span>Add a course </span>
                        <span className="icon is-small">
                            <i className="fas fa-plus" aria-hidden="true"></i>
                        </span>
                    </a>
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