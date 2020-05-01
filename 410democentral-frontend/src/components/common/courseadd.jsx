import React, {useState} from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';

import {fetchGroups} from '../../redux/actions/groupActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const Courseadd = (props) => {

    const [course, setCourse] = useState("");

    const handleCourseChange = (event,newValue) => {
        event.preventDefault()
        if (newValue) {
            setCourse(newValue._id)
        } else {
            setCourse("")
        }
    }

    const joinGroup = async function(event) {
        let addURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"addto/:group")
        addURL.searchParams.append("group", course)
        await fetch(addURL, {
            method: "GET",
			credentials: "include"
		}).then(res => {
            props.setShowCourseAdd(false);
            props.fetchGroups();
        }
        ).catch((err) => {
            //console.log(err);
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
                        <Autocomplete
                            id="combo-box-demo"
                            options={props.courseNames}
                            getOptionLabel={(option) => option._id}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="choose course" variant="outlined" />}
                            onChange={handleCourseChange}

                        />
                    </section>
                    <footer className="modal-card-foot">
                        {(course !== "")?
                            <button className="button is-success" onClick={joinGroup}>Join Course</button>
                            :
                            <button className="button is-static">Join Course</button>
                        }
                    </footer>		   	

                </div>
        </div>
    )

}

export default connect(null, {fetchGroups})(Courseadd);
