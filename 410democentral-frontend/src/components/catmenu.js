import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import 'bulma/css/bulma.css';
import Catselect from './catselect.jsx';
import Codeselect from './codeselect.jsx';

import {fetchCategories} from '../redux/actions/categoryActions'

function CategoryMenu({setGraph, isAdmin, fetchState, dir, fetchCategories}) {
	useEffect(() => {
		fetchCategories();
	}, [])

	if (fetchState.inProgress) {
		return (<div className="container choices">Loading menu...</div>);
	} else if (fetchState.error != null) {
		return (
			<div className="container choices">
				Error loading categories: {fetchState.error.message}
			</div>);
	}

	return (
		<div className="container choices">
			{dir.filter((groupcat) => {
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
										<div key={j}>											
											<Catselect cat={item} isAdmin={isAdmin} setGraph={setGraph} startOpen={true} key={j} />											
										</div>
										)
								}
								else if (item.type === "sample") {
									return (
										<div key={j}>				
											<Codeselect progID={item._id} progName={item.name} isAdmin={isAdmin} setGraph={setGraph} parent={groupcat._id} key={j} />	
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


const mapStateToProps = state => ({
	fetchState: state.categories.fetchState,
	dir: state.categories.catTree
});


export default connect(mapStateToProps, {fetchCategories})(CategoryMenu);
