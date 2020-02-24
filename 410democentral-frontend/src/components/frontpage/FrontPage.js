import React from 'react';
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
          name: 'Dummy code',
          code: 'console.log("Hello world")'
        },{
          name: 'Dummy code 2',
          code: 'this code sucks'
        }
      ]},

      {subcat: 'Category 2',
      programs: [
        {
          name: 'Dummy code 3',
          code: 'Bruh'
        },{
          name: 'Dummy code 4',
          code: 'console.log("Test code")'
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
           name: "Dummy code 5",
           code: "Let's gooo"
         }
       ]
     }
   ]
  }
]



function FrontPage() {
  return (
    <div>
      <div className="columns">
        <div className="column is-one-fifth section">
          <Choices data={dummydata}/>
        </div>
        <div className="column section">
          <Content code={dummydata[0]}/>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;