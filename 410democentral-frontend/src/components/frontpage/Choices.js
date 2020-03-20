import React from 'react';
import 'bulma/css/bulma.css';

import Catselect from './catselect.jsx';

function Choices(props) {
  let data = props.data;
  const setCode = props.setCode;
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
                      <Catselect j={j} i={i} subcat={subcat} setCode={props.setCode} setName={props.setName}/>
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