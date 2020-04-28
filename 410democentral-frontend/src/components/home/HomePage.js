import React, { useState} from 'react';
import {connect} from 'react-redux';

// Redux imports
import {fetchGroups, setGroupViewMode, removeMemberFromGroup} from '../../redux/actions/groupActions';

// View imports
import 'bulma/css/bulma.css';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CategoryMenu from './common/catmenu';
import UserContent from './userview/UserContent';
import AdminContent from './adminview/AdminContent';



const HomePage = ({
    groupFetchState,
    group,
    fetchGroups,
    setGroupViewMode,
    removeMemberFromGroup
}) => {

    const [graph, setGraph] = useState({show: false, data: []});

    const handleModeToggle = (event, newState) => {
        setGroupViewMode(group.name, newState);
    }

    const handleDropCourse = (event) => {
        if (group.name !== "My Code") {
            console.log(group.name)
            removeMemberFromGroup(group.name)
        } else {
            return
        }
    }

    console.log("hello")
    console.log(group);
    if (typeof group === "undefined" || groupFetchState.inProgress) {
        return (<div></div>);
    } else if (groupFetchState.error !== null) {
        return (<div>Error fetching group: {groupFetchState.error.message} </div>);
    }

    return (
        <div>
            <div className="columns">
                <div className="column is-one-fifth section">
                    <CategoryMenu isAdmin={group.adminMode} setGraph={setGraph}/>
                </div>
                <div className="column section">
                    <div className="content-header level">
                        <div className="level-left title">
                            {
                                ((typeof group.name==="string") ?
                                group.name
                                :
                                group.name._id)
                            }
                        </div>
                        <div className="level-right">
                        {group.isInstructor ?
                                <ToggleButtonGroup className="mode-toggle" value={group.adminMode} 
                                    exclusive onChange={handleModeToggle}>
                                    <ToggleButton key={0} value={false}>User View</ToggleButton>
                                    <ToggleButton key={1} value={true}>Admin View</ToggleButton>
                                </ToggleButtonGroup>
                        :
                            <span></span>
                        }
                        </div>
                    </div>
                    {group.adminMode ? 
                        <AdminContent />
                    :
                        <UserContent graph={graph} setGraph={setGraph} />
                    }
                </div>
            </div>
            {(group.name !== "My Code")?
                <div>
                    <button className="button is-small" onClick={handleDropCourse}>Drop Course</button>
                </div>
                :
                <span></span>
            }
        </div>
    );
}

const mapStateToProps = state => ({
    groupFetchState: state.groups.fetchState,
    group: state.groups.groups[state.groups.activeGroup],
    
});

export default connect(mapStateToProps, {
    fetchGroups,
    setGroupViewMode,
    removeMemberFromGroup
})(HomePage);
