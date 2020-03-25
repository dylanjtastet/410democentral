import React, { useState } from 'react';
import 'bulma/css/bulma.css';
import Choices from './Choices';
import Content from './Content';

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
  const [id, setId] = useState(dummydata[0].subcats[0].programs[0].id)
  
  return (
    <div>
      <nav className="navbar is-info" role="navigation" aria-label="main navigation">
        <div className="navbar-menu">
          <div className="navbar-brand">
            <a className="title titletext choices">210 Demo Central</a>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-light">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>


      <div className="columns">
        <div className="column is-one-fifth section">
          <Choices data={dummydata} setCode={setCode} setName={setName} id={id} setId={setId}/>
        </div>
        <div className="column section">
          <Content code={code} name={name} setCode={setCode} setName={setName}/>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;