import React from 'react';
import logo from './logo.svg';
import './App.css';
import FrontPage from './components/frontpage/FrontPage';
import AdminPage from './components/adminpage/AdminPage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar is-info" role="navigation" aria-label="main navigation">
          <div className="navbar-menu">
            <div className="navbar-brand">
              <a className="title titletext choices">210 Demo Central</a>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <Link to="/" className="button is-light">Home
                  </Link>
                  <Link to="/admin" className="button is-light">Admin
                  </Link>
                  <a className="button is-light">
                    Log in
                  </a>
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
            <FrontPage />
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
