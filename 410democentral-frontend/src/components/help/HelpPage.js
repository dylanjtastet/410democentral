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

                                <br></br><br></br>Note: <span className="inlinecode"> console.log </span> only supports one argument at the moment.
                            </p>
                         </div>
                     </div>
                 </div>
                <br></br>
                <div className="container">
                    <h1 className="title is-5">Line Graphs</h1>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                For one, you can try using the <span className="inlinecode"> getLineGraph </span> function, which
                                takes a list of objects as input, each with an x and y value and then plots the resulting graph! This can be useful
                                to analyze the running time of your code as the input size increases.
                            </p>
                        </div>
                        <div className="columns">
                            <figure className="image">
                                <img src={require("./HelpImages/getLineGraphExample.png")} alt="getLineGraph Example"/>
                            </figure>
                        </div>
                    </div>
                 </div>
                 <div className="container">
                    <h1 className="title is-5">UI Widgets</h1>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                We've also provided some simple UI widgets that let you change the value of a variable through the user interface!
                                The three main ones are continuousRange, integerRange, and Boolean. These are initialized in an
                                <span className="inlinecode"> initvars </span> function which you should create and call at the top of your code. In
                                this function, you should set the value of global variables to the calls of the form
                                <ul style={{"list-style-type": "circle", "padding-left": "40px"}}>
                                       <li><span className="inlinecode">continuousRange(minimum_value, maximum_value, label)</span></li>
                                       <li><span className="inlinecode">integerRange(minimum_value, maximum_value, label)</span></li>
                                       <li><span className="inlinecode">getBoolean(label)</span></li>
                                </ul>
                            </p>
                        </div>
                        <div className="columns">
                            <figure className="image">
                                <img src={require("./HelpImages/UIWidgets.png")} alt="UI Widgets Example"/>
                            </figure>
                        </div>
                    </div>
                </div>  
            </section>

            <section className="section">
                <div className="container">
                    <h1 className="title is-3">Building a Course</h1>
                    <p>
                        The following section is meant to provide guidance to instructors who are building a course for their students.
                        Note: as of right now, in order to become an instructor of a course, you must be manually added as one by an
                        administrator.
                    </p>
                </div>
                <br></br>
                <div className="container">
                    <h2 className="title is-5">Navigating to Your Course</h2>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                To view your course, select it from the course dropdown in the navbar. If you haven't added materials,
                                the left-side menu should be empty. To add new categories and samples, select "Admin View" in the upper
                                right corner of the course view.
                            </p>
                        </div>
                        <div className="column">
                            <figure className="image">
                                <img src={require("./HelpImages/AdminToggle.png")} alt="Admin toggle"/>
                            </figure>
                        </div>
                    </div>
                </div>
                <br></br>
                <div className="container">
                    <h2 className="title is-5">Adding Samples and Categories</h2>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                Click on the "Add Code" button to starting adding a sample. If you're starting from scratch, the
                                first thing you'll want to do is create a new category. You shouldn't be able to select a parent
                                category yet, so just type in a category and click Add! This should produce an upper-level category
                                that pops up on the left side of your screen. While you can add samples directly to these upper-level
                                categories, we find that it is often useful to add subcategories first. To do so, create another category,
                                but this time select an existing category as the parent.
                            </p>
                        </div>
                        <div className="column">
                            <figure className="image">
                                <img src={require("./HelpImages/CreateCat.png")} alt="Cat create"/>
                            </figure>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                Once the categories are to your satisfaction, it's time to start adding code! Select the category you'd
                                like to use from the top left corner of the Add Code modal, and then write in a sample name. The next step
                                is to upload the code itself, either via copy and paste or file upload. Once you have done so, click on
                                "Save Changes" and you should see your newly added sample in the left-side menu. If you'd like to go back
                                and edit it, select the code from the menu and click "Edit Selected Code".
                            </p>
                        </div>
                        <div className="column">
                            <figure className="image">
                                <img src={require("./HelpImages/EditCode.png")} alt="Edit code"/>
                            </figure>
                        </div>
                    </div>
                </div>
               
                <div className="container">
                    <h2 className="title is-5">Removing Samples and Categories</h2>
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <p>
                                You may remove samples and categories by righting clicking them in the menu and selecting
                                delete. Beware! Deleting a category will delete all of its children categories and samples
                                as well!
                            </p>
                        </div>
                        <div className="column">
                            <figure className="image">
                                <img src={require("./HelpImages/DeleteSample.png")} alt="Delete sample"/>
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
