import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import 'bulma/css/bulma.css';
import Catselect from './catselect.jsx';
import Codeselect from './codeselect.jsx';

import { fetchCategories } from '../../../redux/actions/categoryActions'

function CategoryMenu({
	setGraph,
	isAdmin,
	catFetchState,
	dir,
	activeGroup,
	fetchCategories
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

	console.error("dir = " + JSON.stringify(dir));
	console.error("activeGroup = " + activeGroup);

	let groupdir;
	if (typeof (activeGroup) == "string") {
		groupdir = dir[activeGroup];
	} else {
		groupdir = dir[activeGroup._id];
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
							<p className="menu-label titletext">
								{groupcat.name}
							</p>
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
							<ul className="menu-list">
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


export default connect(mapStateToProps, { fetchCategories })(CategoryMenu);
