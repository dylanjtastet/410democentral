import React, { useState } from 'react';
import { connect } from 'react-redux';
import 'bulma/css/bulma.css';
import '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import Studentadd from './studentadd.jsx';
import {
  addMemberToGroup,
  removeMemberFromGroup
} from '../../../redux/actions/groupActions';

function StudentsTab(props) {
  const [student, setStudent] = useState("");
  const [adding, setAdding] = useState(false);

  const selectStudent = function(student) {
      return () => {
        setStudent(student);
      }
  }

  const startAdd = function() {
      setAdding(true);
  }

  const handleRemoveStudent = event => {
    props.removeMemberFromGroup(props.group, student);
    setStudent("");
  }

  return (
    <div>
      <div className="subtitle">Manage Students</div>
      <div className="columns">
        <div className="column is-one-third">
          <div className="studentlist">
            <ul>
                {props.members.map(function(member,index) {
                    if (member.username === student) {
                        return <li className="selected" onClick={selectStudent(member.username)} key={index}>{member.username}</li> 
                    } else {
                        return <li className="pointer" onClick={selectStudent(member.username)} key={index}>{member.username}</li> 
                    }
                    
                })}
            </ul>
          </div>
        </div>
        <div className="column">
          {(!adding) ?
              <div>
                {/*
                <div className="paraminputs">
                    <button className="button is-info" onClick={startAdd}>
                        Add Student
                    </button>
                </div>
                */}
                <div>
                    {(student==="") ?
                      <button className="button is-static">
                        Remove Student
                      </button>
                      :
                      <button className="button is-danger" onClick={handleRemoveStudent}>
                          Remove Student
                      </button>
                    }
                </div>
              </div>
            :
              {/*<Studentadd setAdding={setAdding}/>*/}
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  members: state.groups.groups[state.groups.activeGroup].members,
  group: state.groups.activeGroup
});
  
export default connect(mapStateToProps, {
  addMemberToGroup,
  removeMemberFromGroup
 })(StudentsTab);
