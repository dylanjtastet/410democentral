import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import Choices from './Choices';
import Content from './Content';
import Login from '../login/Login';
import Cookies from 'js-cookie';

let dummydata = [
  {
   cat: 'Algorithms',
   subcats: [
     {subcat: 'Category 1',
      programs: [
        {
          id: 1,
          name: 'Dummy code',
          code: 'console.log("Hello world"); \nlet num = 1;'
        },{
          id: 2,
          name: 'Dummy code 2',
          code: 'console.log("???");'
        }
      ]},

      {subcat: 'Category 2',
      programs: [
        {
          id: 3,
          name: 'Dummy code 3',
          code: 'console.log("Testing testing");'
        },{
          id: 4,
          name: 'Dummy code 4',
          code: 'console.log("Test code");'
        }
      ]}
   ]
  },{
   cat: 'Data Structures',
   subcats: [
     {
       subcat: 'Category 3',
       programs: [
         {
           id: 5,
           name: "Dummy code 5",
           code: "console.log('Lets go');"
         }
       ]
     }
   ]
  }
]

function FrontPage() {
  const [code, setCode] = useState(dummydata[0].subcats[0].programs[0].code);
  const [name, setName] = useState(dummydata[0].subcats[0].programs[0].name);
  const [id, setId] = useState(dummydata[0].subcats[0].programs[0].id);
  const [graph, setGraph] = useState({show: false, data: []});
  const [sessid, setSessid] = useState(Cookies.get('sessid'));

  let logout = () => {
    Cookies.remove("sessid");
    setSessid(false);
  }
  
  function Nav() {
    return (    
      <nav className="navbar is-info" role="navigation" aria-label="main navigation">
        <div className="navbar-menu">
          <div className="navbar-brand">
            <a className="title titletext choices">210 Demo Central</a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <LogoutBtn/>
              </div>
            </div>
          </div>

        </div>
      </nav>); 
  }

  function LogoutBtn(){
    if(sessid){
      return(
        <a className="button is-light" onClick = {logout}>
          Logout
        </a>
      )
    }
    return null;
  }

  if(sessid){
    return (
      <div>
        <Nav/>
        <div className="columns">
          <div className="column is-one-fifth section">
            <Choices data={dummydata} setCode={setCode} setName={setName} id={id} setId={setId} setGraph={setGraph}/>
          </div>
          <div className="column section">
            <Content code={code} name={name} setCode={setCode} setName={setName} graph={graph} setGraph={setGraph}/>
          </div>
        </div>
      </div>
    );
  }
  else{
    return (
      <div>
        <Nav/>
        <Login setSessid = {setSessid}></Login>
      </div>
    );
  }
}

export default FrontPage;