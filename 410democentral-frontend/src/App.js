import React, { useState } from 'react';
import { connect } from 'react-redux';
import './App.css';
import HomePage from './components/home/HomePage';
import HelpPage from './components/help/HelpPage';
import CoursePage from './components/courses/CoursePage';
import LoginPage from './components/login/LoginPage';
import Dropdown from './components/common/dropdown';

import Cookies from 'js-cookie';

import {clearSessionState} from './redux/actions/index';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App({
    clearSessionState
}) {
    const [sessid, setSessid] = useState(Cookies.get('sessid'));
    const [isroot, setIsroot] = useState(Cookies.get('isroot'));

    let logout = () => {
        Cookies.remove("sessid");
        Cookies.remove("isroot");
        setSessid(false);
        setIsroot(false);
        clearSessionState();
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

                            {isroot ?
                                <Link to="/courses" className="navbar-item navtab">Manage Courses
                                </Link>
                                :
                                <span></span>
                            }

                            {sessid ?
                                <div className="navbar-item">
                                    <Dropdown />
                                </div>
                            :
                                <span></span>
                            }
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
                            <LoginPage setSessid={setSessid} setIsroot={setIsroot}/>
                        }
                    </Route>
                    <Route path="/help">
                        <HelpPage />
                    </Route>
                    <Route path="/courses">
                        {sessid ?
                            <CoursePage />
                        :
                            <LoginPage setSessid={setSessid} setIsroot={setIsroot}/>
                        }
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default connect(null, {clearSessionState})(App);
