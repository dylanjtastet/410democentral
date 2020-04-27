import React, { useEffect,useState } from 'react';
import 'bulma/css/bulma.css';

import Coursecreate from './coursecreate.jsx'
import Instructoradd from './instructoradd.jsx'

import {connect} from 'react-redux';

// Redux imports
import {fetchGroups, createGroup, deleteGroup, addInstructorToGroup, removeInstructorFromGroup, setActiveGroup} from '../../redux/actions/groupActions';

const CoursePage = ({fetchState, groups, fetchGroups, createGroup, deleteGroup, addInstructorToGroup, removeInstructorFromGroup, groupObjects, setActiveGroup}) => {
    useEffect(() => {
        fetchGroups();
        setAdding(false);
     }, [fetchGroups, createGroup, deleteGroup, addInstructorToGroup, removeInstructorFromGroup]);



    const [course, setCourse] = useState("");
    const [adding, setAdding] = useState(false);

    const [instructors, setInstructors] = useState([]);
    const [instructor, setInstructor] = useState("");
    const [addingInstructor, setAddingInstructor] = useState(false);

    const selectCourse = function(course) {
        return () => {
            setCourse(course);
            setInstructor("")

            let instructors = [];
            let groupObject= groupObjects[course];
            console.log(groupObject);
            if (groupObject.instructors) {
              instructors = groupObject.instructors;
            }

            setInstructors(instructors);
            setAddingInstructor(false);
        }
    }

    const selectInstructor = function(instructor) {
        return () => {
            setInstructor(instructor)
        }
    }

    const startAdd = function() {
        setAdding(true);
    }

    const startInstructorAdd = function() {
        setAddingInstructor(true);
    }

    const addGroup = async (name) => {
        await createGroup(name);
    }

    const handleDelete = async function() {
        await deleteGroup(course);
        setCourse("");
        setInstructors([]);
    }

    const addInstructor = async function(group, instructor) {
        await addInstructorToGroup(group, instructor);

    }

    const removeInstructor = async function() {
         await removeInstructorFromGroup(course, instructor)
         setInstructor("")
         
    }

    return (
        <div className="groupmanage">
          <div className="subtitle">Manage Courses and Instructors</div>
          <div className="columns">
            <div className="column is-one-fourth">
              <div className="studentlist">
                <ul>
                    {groups.map(function(group,index) {
                        if (group) {
                          if (group === "My Code") {
                                return <span></span>
                          } else {
                            if (group === course) {
                                return <li className="selected" onClick={selectCourse(group)} key={index}>{group}</li> 
                            } else {
                                return <li className="pointer" onClick={selectCourse(group)} key={index}>{group}</li> 
                            }
                          }
                        } else {
                            // TODO: was this really intended to return undefined?
                            return undefined
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

            <div className="column is-one-fourth">
              <div className="studentlist">
                <ul>
                    {instructors.map(function(inst,index) {
                        if (inst) {
                            if (inst === instructor) {
                                return <li className="selected" onClick={selectInstructor(inst)} key={index}>{inst}</li> 
                            } else {
                                return <li className="pointer" onClick={selectInstructor(inst)} key={index}>{inst}</li> 
                            }
                        } else {
                            // TODO: was this really intended to return undefined?
                            return <span></span>
                        }
                        
                    })}
                </ul>
              </div>
            </div>
            <div className="column">
              {(!addingInstructor) ?
                  <div>
                    <div className="paraminputs">
                      {(course==="")?
                        <button className="button is-static">
                            Add Instructor
                        </button>
                        :
                        <button className="button is-info" onClick={startInstructorAdd}>
                            Add Instructor
                        </button>
                      }
                    </div>
                    <div>
                        {(instructor==="") ?
                          <button className="button is-static">
                            Remove Instructor
                          </button>
                          :
                          <button className="button is-danger" onClick={removeInstructor}>
                            Remove Instructor
                          </button>
                        }
                    </div>
                  </div>
                :
                  <Instructoradd setAddingInstructor={setAddingInstructor} addInstructor={addInstructor} course={course}/>
              }
            
            </div>
          </div>
        </div>
      );
}

const mapStateToProps = state => ({
    fetchState: state.groups.fetchState,
    groups: state.groups.groupNames,
    groupObjects: state.groups.groups,
    activeGroup: state.groups.activeGroup,
    createGroup: state.groups.createGroup,
    deleteGroup: state.groups.deleteGroup,
    addInstructorToGroup: state.groups.addInstructorToGroup,
    removeInstructorFromGroup: state.groups.removeInstructorFromGroup,
});

export default connect(mapStateToProps, {fetchGroups, createGroup, deleteGroup, addInstructorToGroup, removeInstructorFromGroup, setActiveGroup})(CoursePage);
