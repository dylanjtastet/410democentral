import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css'

import Studentadd from './studentadd.jsx';

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

  return (
    <div>
      <div className="subtitle">Manage Students</div>
      <div className="columns">
        <div className="column is-one-third">
          <div className="studentlist">
            <ul>
                {props.students.map(function(name,index) {
                    if (name==student) {
                        return <li className="selected" onClick={selectStudent(name)} key={index}>{name}</li> 
                    } else {
                        return <li className="pointer" onClick={selectStudent(name)} key={index}>{name}</li> 
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
                        Add Student
                    </button>
                </div>
                <div>
                    {(student==="") ?
                      <button className="button is-static">
                        Remove Student
                      </button>
                      :
                      <button className="button is-danger">
                          Remove Student
                      </button>
                    }
                </div>
              </div>
            :
              <Studentadd setAdding={setAdding}/>
          }
        </div>
      </div>
    </div>
  );
}
  
  export default StudentsTab;