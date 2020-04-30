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
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                For the most part, you can just navigate to a demo in one of your courses and start running JavaScript! Be sure to
                                select the "Edit" tab or "Make a copy" of an uneditable demo in order to make your own changes. We provide a few
                                extra features that might be useful in running and creating Demos.

                                For one, you can try using the <span className="inlinecode">getLineGraph</span> function, which
                                takes a list of objects as input, each with an x and y value and then plots the resulting graph! This can be useful
                                to analyze the running time of your code as the input size increases.
                            </p>
                        </div>
                        <div className="column">
                            <figure className="image">
                                <img src={require("./HelpImages/getLineGraphExample.png")} alt="getLineGraph Example"/>
                            </figure>
                        </div>
                    </div>
                </div>
                 
            </section>
            <section className="section"> </section>
        </div>
        );
}

export default HelpPage;
