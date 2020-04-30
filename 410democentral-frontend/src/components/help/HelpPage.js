import React from 'react';
import 'bulma/css/bulma.css';

const HelpPage = () => {

    return (
        <div>
            <section className="section"> 
                <div className="container">
                    <h1 className="title is-3">General</h1>
                    <p>Welcome to 210 Demo Central! The following help page provides tips for how to use the site.</p>
                </div>
                <br></br>
                <div className="container">
                    <h2 className="title is-5">Getting Started</h2>
                    <p>
                        If you haven't already registered, you can do so by navigating to the login page! Just click the home tab to view it. 
                        Select the "Register" button, where you will be prompted to enter a username, email, and password.
                    </p>
                    <br></br>
                    <p>
                        After registering, return to the login page and enter your username and password.
                    </p>
                </div>
                <br></br>
                <div className="container">
                    <h2 className="title is-5">Joining a Course</h2>
                    <div className="columns"> 
                        <div className="column is-two-thirds">
                            <p>
                                Once you've logged in, your home page should be titled "My Code" and feature an empty text editor and console. 
                                What you'll probably want to do at this point is join your instructor's course. To do so, click on the dropdown
                                titled "My Code" and select the "Join a Course" option. Doing so should bring up a modal titled "Enter Course
                                Name" (pictured right). Just select the course you'd like to join from the dropdown and click "Join Course" 
                                to finish!
                            </p>
                        </div>
                        <div className="column">
                            <figure className="image">
                                <img src={require("./HelpImages/SelectCourseModal.png")} alt="Select course modal"/>
                            </figure>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h1 className="title is-3">Running Code</h1>
                </div>  
            </section>

            <section className="section">
                <div className="container">
                    <h1 className="title is-3">Building a Course</h1>
                    <p>
                        The following section is meant to provide guidance to instructors who are building a course for their students.
                        Note: As of right now, in order to become an instructor of a course, an administrator must manually add you as
                        one. 
                    </p>
                </div>
                <br></br>
                <div className="container">
                    <h2 className="title is-5">Navigating to Your Course</h2>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                To view your course, select it from the course dropdown in the navbar. If you haven't added materials,
                                the left-side menu should be empty. To add new categories and samples, elect "Admin View" in the upper
                                right corner of the course view.
                            </p>
                        </div>
                    </div>
                </div>
                 
            </section>
            <section className="section"> </section>
        </div>
        );
}

export default HelpPage;
