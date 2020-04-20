import React, {useState} from 'react';
import 'bulma/css/bulma.css';

const Courseadd = (props) => {
    const [course, setCourse] = useState("");

    const handleCourseChange = function(event) {
        event.preventDefault()
        setCourse(event.target.value)
    }

    const joinGroup = async function(event) {
        let addURL = new URL("http://localhost:3009/addto/:group")
        addURL.searchParams.append("group", course)
        await fetch(addURL, {
            method: "GET",
			credentials: "include"
		}).then(res => {
            console.log(res)
            props.setShowCourseAdd(false)
        }
        ).catch((err) => {
            console.log(err);
        })
    }

    return  (
        <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Enter Course Name</p>
                        <button className="delete" aria-label="close"
                            onClick={() => {props.setShowCourseAdd(false)}}>
                        </button>
                    </header>
                    <section className="modal-card-body fix">
                        <input className="input" type="text" placeholder="course name - e.g. Comp210" value={course} onChange={handleCourseChange}></input>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={joinGroup}>Join Course</button>
                    </footer>		   	

                </div>
        </div>
    )

}

export default Courseadd;
