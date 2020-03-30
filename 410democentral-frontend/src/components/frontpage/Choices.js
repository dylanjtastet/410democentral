import React from 'react';
import 'bulma/css/bulma.css';

import Catselect from './catselect.jsx';

function Choices(props) {
  let data = props.data;
  return (
    <div className="container choices">
        {data.map((category,i) => {
          return (
            <aside className="menu" key={i}>
              <p className="menu-label titletext">
                  {category.cat}
              </p>
              <ul className="menu-list">
                {category.subcats.map((subcat,j) => {
                    return (
                      <Catselect subcat={subcat} setCode={props.setCode} setName={props.setName} id={props.id} setId={props.setId} setGraph={props.setGraph} setInput={props.setInput} setParameters={props.setParameters} key={j}/>
                    )
                  })
                }
              </ul>
            </aside>
            )
          })
        }
    </div>
  );
}

export default Choices;