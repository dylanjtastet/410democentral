import React, { useState } from 'react';
import './App.css';
import HomePage from './components/home/HomePage';
import HelpPage from './components/help/HelpPage';
import CoursePage from './components/courses/CoursePage';
import LoginPage from './components/login/LoginPage';
import Dropdown from './components/common/dropdown';

import Cookies from 'js-cookie';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {
    const [sessid, setSessid] = useState(Cookies.get('sessid'));

    let logout = () => {
        Cookies.remove("sessid");
        setSessid(false);
    }

    function LogInOutBtn() {
        if(sessid){
            return(
                <a className="button is-light" onClick = {logout} href="#logout">
                    Logout
                </a>
            );
        } else {
             return (
                 <a className="button is-light" href="#login">
                     Log in
                 </a>
             );
        }
    }

    return (
        <Router>
            <div>
                <nav className="navbar is-info" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a className="title titletext choices" href="#title">210 Demo Central</a>
                    </div>
                    
                    <div className="navbar-menu">

                        <div className="navbar-start navlinks is-tab">
                            <Link to="/" className="navbar-item navtab">Home
                            </Link>
                            <Link to="/help" className="navbar-item navtab">Help
                            </Link>
                            <Link to="/courses" className="navbar-item navtab">Manage Courses
                            </Link>
                            <div className="navbar-item">
                                <Dropdown />
                            </div>
                        </div>

                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="buttons">
                                    {/*
                                    <Link to="/" className="button is-light">Home
                                    </Link>
                                    <Link to="/admin" className="button is-light">Admin
                                    </Link>
                                    */}
                                    <LogInOutBtn/>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/*
                    A <Switch> looks through all its children <Route>
                    elements and renders the first one whose path
                    matches the current URL. Use a <Switch> any time
                    you have multiple routes, but you want only one
                    of them to render at a time
                */}
                <Switch>
                    <Route exact path="/">
                        {sessid ?
                            <HomePage />
                        :
                            <LoginPage setSessid={setSessid} />
                        }
                    </Route>
                    <Route path="/help">
                        <HelpPage />
                    </Route>
                    <Route path="/courses">
                        {sessid ?
                            <CoursePage />
                        :
                            <LoginPage setSessid={setSessid}/>
                        }
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
