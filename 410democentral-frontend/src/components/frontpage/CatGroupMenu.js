import React, {useState, useEffect} from 'react'
import 'bulma/css/bulma.css'

import Catselect from './catselect.jsx'
import Codeselect from './codeselect.jsx'

function CatGroupMenu(props) {
	let [data, setData] = useState([]);

	// Currently this fetch is done by menu component --
	// Not sure if this is the best way to get the data
	useEffect(() => {
		fetch('http://localhost:3009/dir')
		.then(res => res.json())
		.then(data => setData(data));
	}, []);

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
								{groupcat.name}
						</p>
						<ul className="menu-list">
							{groupcat.children.map((item, j) => {
								if (item.type === "category") {
									return (
										<Catselect cat={item} id={props.id} setId={props.setId}
											setGraph={props.setGraph} startOpen={true} key={j} />
										)
								}
								else if (item.type === "sample") {
									return (
										<Codeselect id={props.id} setId={props.setId} setGraph={props.setGraph}
											progID={item._id} name={item.name} key={j} />
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

export default CatGroupMenu;
