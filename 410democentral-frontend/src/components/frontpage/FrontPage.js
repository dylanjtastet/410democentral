import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import CategoryMenu from '../catmenu';
import Content from './Content';
import Login from '../login/Login';

function FrontPage(props) {
  const [graph, setGraph] = useState({show: false, data: []});

  if(props.sessid){
    return (
      <div>
        <div className="columns">
          <div className="column is-one-fifth section">
            <CategoryMenu isAdmin={false} setGraph={setGraph} />
          </div>
          <div className="column section">
            <Content graph={graph} setGraph={setGraph} />
          </div>
        </div>
      </div>
    );
  }
  else{
    return (
      <div>
        <Login setSessid = {props.setSessid}></Login>
      </div>
    );
  }
}

export default FrontPage;
