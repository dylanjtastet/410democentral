import {
	FETCH_GROUPS_BEGIN,
	FETCH_GROUPS_SUCCESS,
	FETCH_GROUPS_FAILURE,

	CREATE_GROUP_BEGIN,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAILURE,

	SET_ACTIVE_GROUP
} from './actionTypes';

/* FETCHING ACTIONS */

export const fetchGroupsBegin = () => ({
	type: FETCH_GROUPS_BEGIN
});

export const fetchGroupsSuccess = groups => ({
	type: FETCH_GROUPS_SUCCESS,
	payload: {groups: groups}
});

export const fetchGroupsFailure = error => ({
	type: FETCH_GROUPS_FAILURE,
	payload: {error: error}
});

export const fetchGroups = () => {
	return dispatch => {
		dispatch(fetchGroupsBegin());
		let groupURL = new URL("http://localhost:3009/group");
		fetch(groupURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			dispatch(fetchGroupsSuccess(data));
			dispatch(setActiveGroup("My Code"));
			return data;
		})
		.catch(error => dispatch(fetchGroupsFailure(error)));
	};
}

/* CREATING ACTIONS */

export const createGroupBegin = () => ({
	type: CREATE_GROUP_BEGIN,
});

export const createGroupSuccess = name => ({
	type: CREATE_GROUP_SUCCESS,
	payload: {name: name}
});

export const createGroupFailure = error => ({
	type: CREATE_GROUP_FAILURE,
	payload: {error: error}
});

export const createGroup = name => {
	return dispatch => {
		dispatch(createGroupBegin());
		let groupURL = new URL("http://localhost:3009/group");
		groupURL.searchParams.append("group", name);
		fetch(groupURL, {
			method: "POST",
			headers: {
				"Content-Type" : "application/json"
			},
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => {
			dispatch(createGroupSuccess());
		})
		.catch(error => dispatch(createGroupFailure(error)));
	};
}

/* LOCAL STATE CHANGING ACTIONS */

export const setActiveGroup = name => ({
	type: SET_ACTIVE_GROUP,
	payload: {name: name}
});
