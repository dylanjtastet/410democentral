import React from 'react'
import 'bulma/css/bulma.css'
import Catselect from './catselect.jsx'
import Codeselect from './codeselect.jsx'

function AdminCatGroupMenu(props) {
	let data = props.data;

	return (
		<div className="container choices">
			{data.filter((groupcat) => {
				if (groupcat.parent != null) {
					console.warn("Top-level category has non-null parent.");
				}
				if (groupcat.type !== "category") {
					console.warn("Server returned non-category menu-item at top level. Skipping.");
					return false;
				}
				return true;
			}).map((groupcat, i) => {
				return (
					<aside className="menu" key={i}>
						<p className="menu-label titletext">
								{groupcat._id}
						</p>
						<ul className="menu-list">
							{groupcat.children.map((item, j) => {
								if (item.type === "category") {
									return (
										<div key={j}>											
											<Catselect cat={item} id={props.id} setId={props.setId} setParent={props.setParent} setProgram={props.setProgram}
												setGraph={props.setGraph} startOpen={true} key={j} refreshCats={props.refreshCats}/>											
										</div>
										)
								}
								else if (item.type === "sample") {
									return (
										<div key={j}>				
											<Codeselect id={props.id} setId={props.setId} setGraph={props.setGraph} parent={groupcat._id} setParent={props.setParent} 
											progID={item._id} name={item.name} key={j} refreshCats={props.refreshCats} setProgram={props.setProgram}/>	
										</div>
										)
								} else {
									return undefined; // could also do some error handling
								}
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

export default AdminCatGroupMenu;
