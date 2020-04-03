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
          name: 'Counting Sort',
          input: 'array',
          code: 'function (array) { \n\tarray.sort(function (a, b) {\n\t\tif (a > b) {\n\t\t\treturn -1;\n\t\t}\n\t\tif (b > a) {\n\t\t\treturn 1;\n\t\t}\n\t\treturn 0;\n\t});\n}'
        },{
          id: 2,
          name: 'Bubble Sort',
          input: 'array',
          code: 'function (arr) {\n\tfunction swap(arr, first_Index, second_Index) {\n\t\tlet temp = arr[first_Index];\n\t\tarr[first_Index] = arr[second_Index];\n\t\tarr[second_Index] = temp;\n\t}\n\tlet len = arr.length,\n\t\ti, j, stop;\n\tfor (i=0; i < len; i++){\n\t\tfor (j=0, stop=len-i; j < stop; j++){\n\t\t\tif (arr[j] > arr[j+1]){\n\t\t\t\tswap(arr, j, j+1);\n\t\t\t}\n\t\t}\n\t}\n\treturn arr;\n}'
        }
      ]},

      {subcat: 'Category 2',
      programs: [
        {
          id: 3,
          name: 'Dummy code 3',
          input: 'none',
          code: 'console.log("Testing testing");'
        },{
          id: 4,
          name: 'Dummy code 4',
          input: 'none',
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
           input: 'none',
           code: "console.log('Lets go');"
         }
       ]
     }
   ]
  }
]

function FrontPage(props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState(-1);
  const [graph, setGraph] = useState({show: false, data: []});
  const [input, setInput] = useState("none");
  const [parameters, setParameters] = useState({})

  if(props.sessid){
    return (
      <div>
        <div className="columns">
          <div className="column is-one-fifth section">
            <Choices data={dummydata} setCode={setCode} setName={setName} id={id} setId={setId} setGraph={setGraph} setInput={setInput} setParameters={setParameters}/>
          </div>
          <div className="column section">
            <Content code={code} name={name} setCode={setCode} setName={setName} graph={graph} setGraph={setGraph} input={input} parameters={parameters} setParameters={setParameters}/>
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
