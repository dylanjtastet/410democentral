import React, { useState } from 'react';
import './App.css';
import FrontPage from './components/frontpage/FrontPage';
import AdminPage from './components/adminpage/AdminPage';
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
          <div className="navbar-menu">
            <div className="navbar-brand">
              <a className="title titletext choices" href="#title">210 Demo Central</a>
            </div>

            <div className="navbar-start navlinks is-tab">
                <Link to="/" className="navbar-item navtab">Home
                </Link>
                <Link to="/admin" className="navbar-item navtab">Admin
                </Link>
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
            <FrontPage sessid={sessid} setSessid={setSessid} />
          </Route>
          <Route path="/admin">
            <AdminPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
