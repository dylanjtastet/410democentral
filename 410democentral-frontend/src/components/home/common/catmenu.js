import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import 'bulma/css/bulma.css';
import Catselect from './catselect.jsx';
import Codeselect from './codeselect.jsx';

import { fetchCategories, deleteCategory } from '../../../redux/actions/categoryActions'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

function CategoryMenu({
	setGraph,
	isAdmin,
	catFetchState,
	dir,
	activeGroup,
	fetchCategories,
	deleteCategory,

}) {
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	if (Object.keys(dir).length === 0
		|| activeGroup === ""
		|| catFetchState.inProgress) {
		return (<div className="container choices">Loading menu...</div>);
	} else if (catFetchState.error !== null) {
		return (
			<div className="container choices">
				Error loading categories: {catFetchState.error.message}
			</div>);
	}

	let groupdir;
	if (typeof (activeGroup) == "string") {
		groupdir = dir[activeGroup];
	} else {
		groupdir = dir[activeGroup._id];
	}

	const handleCatDelete = (id) => {
		return () => {
			if (window.confirm(
			"Are you sure? Deleting a category deletes all " 
			+ "subcategories and the samples contained within.")) {
			deleteCategory(id);
			}
		}
	  }

	return (
		<div className="container choices">
			{groupdir.filter((groupcat) => {
				if (groupcat.parent != null) {
					console.warn("Top-level category has non-null parent.");
				}
				return true;
			}).map((groupcat, i) => {
				if (groupcat.type === "category") {
					return (
						<aside className="menu" key={i}>
							
							<div>
								{isAdmin?
								<div>
									<ContextMenuTrigger id={groupcat._id}>
										<a className="menu-label titletext">{groupcat.name}</a>
									</ContextMenuTrigger>

									<ContextMenu id={groupcat._id}>
										<MenuItem onClick={handleCatDelete(groupcat._id)}>
												<a href="#deletebutton" className="button is-small">Delete</a>
										</MenuItem>
									</ContextMenu>

									
								</div>
								:
								<a className="menu-label titletext">{groupcat.name}</a>
								}
							</div>
							<ul className="menu-list">
								{
									groupcat.children.map((item, j) => {
										if (item.type === "category") {
											return (
												<div key={j}>
													<Catselect cat={item} isAdmin={isAdmin} startOpen={true} key={j} setGraph={setGraph} />
												</div>
											)
										}
										else if (item.type === "sample") {
											return (
												<div key={j}>
													<Codeselect progID={item._id} progName={item.name} isAdmin={isAdmin} parent={groupcat._id} key={j} setGraph={setGraph} />
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
				} else {
					var item = groupcat;
					if (item.type === "sample") {
						return (
							<ul className="menu-list" key={item._id}>
								<div>
									<Codeselect progID={item._id} progName={item.name} isAdmin={isAdmin} parent={groupcat._id} setGraph={setGraph} />
								</div>
							</ul>
						);
					} else {
						return undefined; // could also do some error handling
					}
				}
			})
			}
		</div>
	);
}


const mapStateToProps = state => ({
	catFetchState: state.categories.fetchTreeState,
	dir: state.categories.catTree,
	activeGroup: state.groups.activeGroup
});


export default connect(mapStateToProps, { fetchCategories, deleteCategory })(CategoryMenu);
