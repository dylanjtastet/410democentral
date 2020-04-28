import React, {useState} from 'react';
import 'bulma/css/bulma.css';

export default function Coursecreate(props) {
    const [newcourse, setNewcourse] = useState("");

    const handleChange = function(event) {
        setNewcourse(event.target.value);
    }

    const handleComplete = async function(event) {
        //Add this group to student's groups, refresh list of students
        //If not a student, send message stating that it's not (and don't setAdding(false))
        await props.addCourse(newcourse);
        props.setAdding(false);
    }

    const handleCancel = function(event) {
        props.setAdding(false);
    }
    
    return ( 
        <div>
            <input className="input paraminputs textinput" type="text" placeholder="course name" value={newcourse} onChange={handleChange}></input>
            <div>
                {(newcourse) ?
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