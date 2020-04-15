import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../../../node_modules/bulma-divider/dist/css/bulma-divider.min.css';

import CategoryMenu from '../catmenu.js';
import Login from '../login/Login';
import Dropdown from './dropdown.jsx';
import StudentsTab from './StudentsTab';
import CodeTab from './CodeTab';

const courses = ["Comp 210 Fa20", "Comp 550 Fa20", "Comp 410 Sp20"];
const students = ["Jim Bob", "Junior", "Tony", "Bilbo Baggins", "Samwise Gamgee", "Robert", "Bubba", "Forrest", "Mark", "James", "Geoffrey", "Gilbert", "Martin", "Luke", "Theodore"];

function AdminPage(props) {
  const [parent, setParent] = useState("");
  const [course, setCourse] = useState(courses[0]);


  if(props.sessid){
    return (
      <div>
        <div className="columns">
          <div className="column is-one-fifth section">
            <CategoryMenu isAdmin={true} />
          </div>
          <div className="column section">
            <div className="bottommargin">
              <span className="title">{course}</span>
              <span><Dropdown courses={courses} course={course} setCourse={setCourse}/></span>
            </div>
            <div className="bigbottommargin">
              <CodeTab parent={parent} />
            </div>
            <div className="divider">
              <div className="is-divider"></div>
            </div>
            <StudentsTab students={students}/>
            
            {/*ManagementTabs*/}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Login setSessid = {props.setSessid}></Login>
      </div>
    );
  }
  }
  
  export default AdminPage;
