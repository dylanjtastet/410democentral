import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../../../node_modules/bulma-divider/dist/css/bulma-divider.min.css';

import AdminCatGroupMenu from './AdminCatGroupMenu';
import Login from '../login/Login';
import Dropdown from './dropdown.jsx';
import StudentsTab from './StudentsTab';
import CodeTab from './CodeTab';

const courses = ["Comp 210 Fa20", "Comp 550 Fa20", "Comp 410 Sp20"];
const students = ["Jim Bob", "Junior", "Tony", "Bilbo Baggins", "Samwise Gamgee", "Robert", "Bubba", "Forrest", "Mark", "James", "Geoffrey", "Gilbert", "Martin", "Luke", "Theodore"];

function AdminPage(props) {
  const [id, setId] = useState("");
  const [parent, setParent] = useState("");
  const [course, setCourse] = useState(courses[0]);
  const [cats, setCats] = useState([]);
  const [data, setData] = useState([]);

  const [program, setProgram] = useState({});


  useEffect(() => {
		fetch('http://localhost:3009/category')
		.then(res => res.json())
		.then(data => setCats(data));
  }, []);

  useEffect(() => {
		fetch('http://localhost:3009/dir')
		.then(res => res.json())
		.then(data => setData(data));
	}, []);
  
  const refreshCategories = async () => {
    fetch('http://localhost:3009/category')
		.then(res => res.json())
    .then(data => setCats(data));
    
    fetch('http://localhost:3009/dir')
		.then(res => res.json())
		.then(data => setData(data));
  }

  const refreshProgram = async () => {
      let sampleURL = new URL("http://localhost:3009/sample");
      sampleURL.searchParams.append("id", id);

      await fetch(sampleURL)
        .then((response) => {
            return response.json();
        })
          .then((data) => {
              let code2="";
              if (data.code2 != null) code2=data.code2;
              setProgram({
                  "name": data.name,
                  "code": data.code,
                  "code2": code2
          })
      });
  }

  if(props.sessid){
    return (
      <div>
        <div className="columns">
          <div className="column is-one-fifth section">
            <AdminCatGroupMenu setParent={setParent} id={id} setId={setId} data={data} setData={setData} refreshCats={refreshCategories} setProgram={setProgram}/>
          </div>
          <div className="column section">
            <div className="bottommargin">
              <span className="title">{course}</span>
              <span><Dropdown courses={courses} course={course} setCourse={setCourse}/></span>
            </div>
            <div className="bigbottommargin">
              <CodeTab refreshProgram={refreshProgram} parent={parent} id={id} setId={setId} cats={cats} refreshcats={refreshCategories} program={program}/>
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
