import React, { useState } from 'react';
import Codeselect from './codeselect.jsx';

import ReactDOM from "react-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { checkPropTypes } from 'prop-types';

export default function Catselect(props) {
  const [opened, setOpened] = useState(props.startOpen);
  
  const handleClick = function(event) {
    event.preventDefault();
    setOpened(!opened);
  }

  const handleCatDelete = function(cat) {
		return async () => {
      if (window.confirm("Are you sure? Deleting a category deletes all subcategories and the samples contained within.")) {
			let catURL = new URL("http://localhost:3009/category");

			//catURL.searchParams.append("name", cat);
			console.log(cat)

      let response = await fetch(catURL, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({name: cat})
      });
      console.log(response);
      await props.refreshCats();
        } else {
          return;
        }
		  }
	  }
  
  return (
    <li>
    <ContextMenuTrigger id={props.cat._id}>
      <a onClick={handleClick} href="#category">{props.cat._id}</a>
    </ContextMenuTrigger>

    <ContextMenu id={props.cat._id}>
				<MenuItem onClick={handleCatDelete(props.cat._id)}>
						<a className="box">Delete</a>
				</MenuItem>
		</ContextMenu>

    {opened ?
      <ul>
        {props.cat.children.map((item, i) => {
          if (item.type === "category") {
            return (
              <Catselect cat={item} id={props.id} setId={props.setId} setParent={props.setParent} setProgram={props.setProgram}
                setGraph={props.setGraph} startOpen={false} key={i} refreshCats={props.refreshCats}/>
              )
          }
          else if (item.type === "sample") {
            return (
              <Codeselect id={props.id} setId={props.setId} setGraph={props.setGraph} parent={props.cat._id} setParent={props.setParent}
                progID={item._id} name={item.name} key={i} refreshCats={props.refreshCats} setProgram={props.setProgram}/>
              )
          } else {
            return undefined; // could also do some error handling
          }
        })}
      </ul>
      :
      <span></span>
    }
    </li>
  )
}
