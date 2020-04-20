import React, { useEffect,useState } from 'react';
import 'bulma/css/bulma.css';

import Coursecreate from './coursecreate.jsx'

import {connect} from 'react-redux';

// Redux imports
import {fetchGroups,setActiveGroup,createGroup,deleteGroup} from '../../redux/actions/groupActions';

const CoursePage = ({fetchState, groups, activeGroup, fetchGroups, setActiveGroup, createGroup, deleteGroup}) => {

    useEffect(() => {
        fetchGroups();
        setActiveGroup("")
     }, []);

    const [course, setCourse] = useState("");
    const [adding, setAdding] = useState(false);

    const selectCourse = function(course) {
        return () => {
            setCourse(course._id);
        }
    }

    const startAdd = function() {
        setAdding(true);
    }

    const addGroup = async (name) => {
        createGroup(name);
    }

    const handleDelete = async function() {
        deleteGroup(course);
    }

    return (
        <div className="groupmanage">
          <div className="subtitle">Manage Courses</div>
          <div className="columns">
            <div className="column is-one-third">
              <div className="studentlist">
                <ul>
                    {groups.map(function(group,index) {
                        if (group) {
                            if (group._id === course) {
                                return <li className="selected" onClick={selectCourse(group)} key={index}>{group._id}</li> 
                            } else {
                                return <li className="pointer" onClick={selectCourse(group)} key={index}>{group._id}</li> 
                            }
                        } else {
                            return
                        }
                        
                    })}
                </ul>
              </div>
            </div>
            <div className="column">
              {(!adding) ?
                  <div>
                    <div className="paraminputs">
                        <button className="button is-info" onClick={startAdd}>
                            Add Course
                        </button>
                    </div>
                    <div>
                        {(course==="") ?
                          <button className="button is-static">
                            Remove Course
                          </button>
                          :
                          <button className="button is-danger" onClick={handleDelete}>
                            Remove Course
                          </button>
                        }
                    </div>
                  </div>
                :
                  <Coursecreate setAdding={setAdding} addCourse={addGroup}/>
              }
            </div>
          </div>
        </div>
      );
}

const mapStateToProps = state => ({
    fetchState: state.groups.fetchState,
    groups: state.groups.groupNames,
    activeGroup: state.groups.activeGroup,
    createGroup: state.groups.createGroup,
    deleteGroup: state.groups.deleteGroup
});

export default connect(mapStateToProps, {fetchGroups, setActiveGroup, createGroup, deleteGroup})(CoursePage);