import React from 'react';
import 'bulma/css/bulma.css';

function Choices(props) {
  let data = props.data;
  return (
    <div className="container">
        {data.map((category,i) => {
          return (
            <aside className="menu">
              <p class="menu-label">
                  {category.cat}
              </p>
              <ul class="menu-list">
                {category.subcats.map((subcat,j) => {
                    return (
                      <li>
                        <a>{subcat.subcat}</a>
                        <ul>
                          {subcat.programs.map((program,k) => {
                            return(<li><a>{program.name}</a></li>)
                          })}
                        </ul>
                      </li>
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