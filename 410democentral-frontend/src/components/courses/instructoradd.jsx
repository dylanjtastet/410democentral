import React, {useState} from 'react';
import 'bulma/css/bulma.css';

export default function Instructoradd(props) {
    const [newinstructor, setNewInstructor] = useState("");

    const handleChange = function(event) {
        setNewInstructor(event.target.value);
    }

    const handleComplete = async function(event) {
        //Add this group to student's groups, refresh list of students
        //If not a student, send message stating that it's not (and don't setAdding(false))
        await props.addInstructor(props.course, newinstructor);
        props.setAddingInstructor(false);
    }

    const handleCancel = function(event) {
        props.setAddingInstructor(false);
    }
    
    return ( 
        <div>
            <input className="input paraminputs textinput" type="text" placeholder="instructor username" value={newinstructor} onChange={handleChange}></input>
            <div>
                {   (newinstructor) ?
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