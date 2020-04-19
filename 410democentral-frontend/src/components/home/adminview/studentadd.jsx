import React, {useState} from 'react';
import 'bulma/css/bulma.css';

export default function Studentadd(props) {
    const [student, setStudent] = useState("");

    const handleChange = function(event) {
        setStudent(event.target.value);
    }

    const handleComplete = function(event) {
        //Add this group to student's groups, refresh list of students
        //If not a student, send message stating that it's not (and don't setAdding(false))
        props.setAdding(false);
    }

    const handleCancel = function(event) {
        props.setAdding(false);
    }
    
    return ( 
        <div>
            <input className="input paraminputs textinput" type="text" placeholder="student username or email" value={student} onChange={handleChange}></input>
            <div>
                {(student) ?
                    <span className="rightmargin">
                        <button className="button" onClick={handleComplete}>
                            Add
                        </button>
                    </span>
                    :
                    <span className="rightmargin">
                        <button className="button is-static">
                            Add
                        </button>
                    </span>
                }
                <span>
                    <button className="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </span>
            </div>
        </div>
    );
}