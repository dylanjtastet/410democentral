import React, { useState } from 'react';
import {connect} from 'react-redux';
import {deleteCategory} from '../../../redux/actions/categoryActions';

import Codeselect from './codeselect.jsx';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const Catselect = ({
  cat,
  isAdmin,
  startOpen,
  deleteCategory,
  setGraph
}) => {
  const [opened, setOpened] = useState(startOpen);
  
  const handleClick = function(event) {
    event.preventDefault();
    setOpened(!opened);
  }

  const handleCatDelete = () => {
    if (window.confirm(
      "Are you sure? Deleting a category deletes all " 
      + "subcategories and the samples contained within.")) {
      deleteCategory(cat._id);
	  }
  }
  
  return (
    <li>
      <div>
        {isAdmin ? 
        <>
          <ContextMenuTrigger id={cat._id}>
            <a onClick={handleClick} href="#category">{cat.name}</a>
          </ContextMenuTrigger>

          <ContextMenu id={cat._id}>
      				<MenuItem onClick={handleCatDelete}>
      						<a href="#deletebutton" className="box">Delete</a>
      				</MenuItem>
      		</ContextMenu>
        </>
        :
          <a onClick={handleClick} href="#category">{cat.name}</a>
        }
        {opened ?
          <ul>
            {cat.children.map((item, i) => {
              if (item.type === "category") {
                return (
                  <Catselect cat={item} isAdmin={isAdmin} startOpen={false} key={i} setGraph={setGraph}/>
                  )
              }
              else if (item.type === "sample") {
                return (
                  <Codeselect progID={item._id} progName={item.name} isAdmin={isAdmin} parent={cat._id} key={i} setGraph={setGraph}/>
                  )
              } else {
                return undefined; // could also do some error handling
              }
            })}
          </ul>
        :
          <span></span>
        }
      </div>
    </li>
  )
}

export default connect(null, {deleteCategory})(Catselect);