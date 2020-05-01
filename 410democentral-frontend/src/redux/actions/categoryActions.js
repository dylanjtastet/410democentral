import {
FETCH_CATEGORY_ARRAY_BEGIN,
FETCH_CATEGORY_ARRAY_SUCCESS,
FETCH_CATEGORY_ARRAY_FAILURE,

FETCH_CATEGORY_TREE_BEGIN,
FETCH_CATEGORY_TREE_SUCCESS,
FETCH_CATEGORY_TREE_FAILURE,

CREATE_CATEGORY_BEGIN,
CREATE_CATEGORY_SUCCESS,
CREATE_CATEGORY_FAILURE,

UPDATE_CATEGORY_BEGIN,
UPDATE_CATEGORY_SUCCESS,
UPDATE_CATEGORY_FAILURE,

DELETE_CATEGORY_BEGIN,
DELETE_CATEGORY_SUCCESS,
DELETE_CATEGORY_FAILURE
} from './actionTypes';


/* FETCHING ACTIONS */

export const fetchCategoryArrayBegin = () => ({
	type: FETCH_CATEGORY_ARRAY_BEGIN
});

export const fetchCategoryArraySuccess = catArray => ({
	type: FETCH_CATEGORY_ARRAY_SUCCESS,
	payload: {catArray: catArray}
});

export const fetchCategoryArrayFailure = error => ({
	type: FETCH_CATEGORY_ARRAY_FAILURE,
	payload: {error: error}
});

export const fetchCategoryTreeBegin = () => ({
	type: FETCH_CATEGORY_TREE_BEGIN
});


export const fetchCategoryTreeSuccess = catTree => ({
	type: FETCH_CATEGORY_TREE_SUCCESS,
	payload: {catTree: catTree}
});

export const fetchCategoryTreeFailure = error => ({
	type: FETCH_CATEGORY_TREE_FAILURE,
	payload: {error: error}
});

export const fetchCategoryArray = () => {
	return dispatch => {
		dispatch(fetchCategoryArrayBegin());
		let categoryURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"allcategories");
		fetch(categoryURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			dispatch(fetchCategoryArraySuccess(data));
			return data;
		})
		.catch(error => dispatch(fetchCategoryArrayFailure(error)));
	};
}

export const fetchCategoryTree = () => {
	return dispatch => {
		dispatch(fetchCategoryTreeBegin());
		let dirURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"dir");
		fetch(dirURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			let catTree = data.reduce((cats, cat) => {
				if (cat.type === "usercode") {
					cat._id = "My Code";
				}
				cats[cat._id] = cat.children;
				return cats;
			}, {});
			dispatch(fetchCategoryTreeSuccess(catTree));
			return data;
		})
		.catch(error => dispatch(fetchCategoryTreeFailure(error)));
	};
}

// This is redundant ofc but gonna keep for now
export const fetchCategories = () => {
	return dispatch => {
		dispatch(fetchCategoryArray());
		dispatch(fetchCategoryTree());
	};
}

/* CREATING ACTIONS */

export const createCategoryBegin = () => ({
	type: CREATE_CATEGORY_BEGIN,
});

export const createCategorySuccess = (id, name, parent, group) => ({
	type: CREATE_CATEGORY_SUCCESS,
	payload: {id: id, name: name, parent: parent, group: group}
});

export const createCategoryFailure = error => ({
	type: CREATE_CATEGORY_FAILURE,
	payload: {error: error}
});

export const createCategory = (name, parent, group) => {
	return dispatch => {
		dispatch(createCategoryBegin());
		let categoryURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"category");
		categoryURL.searchParams.append("name", name);
		categoryURL.searchParams.append("parent", parent);
		categoryURL.searchParams.append("group", group);

		fetch(categoryURL, {
			credentials: "include",
			method: "POST"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			dispatch(createCategorySuccess(data.newId, name, parent, group));
			// Create function fetches tree after completion as
			// it's easier to do so than try to place the node manually
			dispatch(fetchCategories());
			return data;
		})
		.catch(error => dispatch(createCategoryFailure(error)));
	};
}

/* UPDATING ACTIONS */

export const updateCategoryBegin = id => ({
	type: UPDATE_CATEGORY_BEGIN,
	payload: {id: id}
});

export const updateCategorySuccess = (id, name, parent, group) => ({
	type: UPDATE_CATEGORY_SUCCESS,
	payload: {id: id, name: name, parent: parent, group: group}
});

export const updateCategoryFailure = error => ({
	type: UPDATE_CATEGORY_FAILURE,
	payload: {error: error}
});

export const updateCategory = (id, name, parent, group) => {
	return dispatch => {
		dispatch(updateCategoryBegin(id));
		let categoryURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"category");
		categoryURL.searchParams.append("id", id);
		fetch(categoryURL, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({name: name, parent: parent, group: group})
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			dispatch(updateCategorySuccess(id, name, parent, group));
			return data;
		})
		.catch(error => dispatch(updateCategoryFailure(error)));
	};
}

/* DELETING ACTIONS */

export const deleteCategoryBegin = id => ({
	type: DELETE_CATEGORY_BEGIN,
	payload: {id: id}
});

export const deleteCategorySuccess = id => ({
	type: DELETE_CATEGORY_SUCCESS,
	payload: {id: id}
});

export const deleteCategoryFailure = error => ({
	type: DELETE_CATEGORY_FAILURE,
	payload: {error: error}
});

export const deleteCategory = id => {
	return dispatch => {
		dispatch(deleteCategoryBegin(id));
		let categoryURL = new URL(process.env.REACT_APP_BASEURL + ":" + process.env.REACT_APP_BACKEND_PORT + "/"+"category");
		categoryURL.searchParams.append("id", id);
		fetch(categoryURL, {
			credentials: "include",
			method: "DELETE",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({id: id})
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => {
			dispatch(deleteCategorySuccess(id));
			// Since a category deletion can lead to multiple other
			// category + sample deletions, we do a full fetch afterwards
			dispatch(fetchCategories());
			return res;
		});
		//.catch(error => dispatch(deleteCategoryFailure(error)));
	};
}
