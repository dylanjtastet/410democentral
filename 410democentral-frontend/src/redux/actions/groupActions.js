import {
	FETCH_GROUPS_BEGIN,
	FETCH_GROUPS_SUCCESS,
	FETCH_GROUPS_FAILURE,

	CREATE_GROUP_BEGIN,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAILURE,

	ADD_MEMBER_TO_GROUP_BEGIN,
	ADD_MEMBER_TO_GROUP_SUCCESS,
	ADD_MEMBER_TO_GROUP_FAILURE,

	REMOVE_MEMBER_FROM_GROUP_BEGIN,
	REMOVE_MEMBER_FROM_GROUP_SUCCESS,
	REMOVE_MEMBER_FROM_GROUP_FAILURE,

	DELETE_GROUP_BEGIN,
	DELETE_GROUP_SUCCESS,
	DELETE_GROUP_FAILURE,

	SET_ACTIVE_GROUP,
	SET_GROUP_VIEW_MODE,


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
	return async dispatch => {
		dispatch(fetchGroupsBegin());
		let allgroupURL = new URL("http://localhost:3009/allgroups");
		try {
			let res = await fetch(allgroupURL, {
				credentials: "include"
			});
			if (!res.ok) throw Error(res.statusText);
			let data = await res.json();
			data = [...data, {
				_id: "My Code",
				isInstructor: false,
				adminMode: false
			}];

			for (let i = 0; i < data.length; i++) {
				if (data[i].isInstructor) {
					let groupURL = new URL("http://localhost:3009/group");
					console.log(data[i])
					if (typeof data[i]._id==="string") {
						groupURL.searchParams.append("name", data[i]._id);
					} else {
						groupURL.searchParams.append("name", data[i]._id._id);
					}
					let inner_res = await fetch(groupURL, {
						credentials: "include"
					});
					if (!inner_res.ok) throw Error(inner_res.statusText);
					let inner_data = await inner_res.json();
					data[i].members = inner_data;
				}
			}

			dispatch(fetchGroupsSuccess(data));
			dispatch(setActiveGroup("My Code"));
		}
		catch(error) {
			dispatch(fetchGroupsFailure(error));
		}
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
		groupURL.searchParams.append("name", name);
		fetch(groupURL, {
			method: "POST",
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => {
			dispatch(createGroupSuccess(name));
			dispatch(fetchGroups());
		})
		.catch(error => dispatch(createGroupFailure(error)));
	};
}

/* UPDATING ACTIONS */

export const addMemberToGroupBegin = name => ({
	type: ADD_MEMBER_TO_GROUP_BEGIN,
	payload: {name: name}
});

export const addMemberToGroupSuccess = () => ({
	type: ADD_MEMBER_TO_GROUP_SUCCESS
});

export const addMemberToGroupFailure = error => ({
	type: ADD_MEMBER_TO_GROUP_FAILURE,
	payload: {error: error}
});

export const addMemberToGroup = (name, member = null) => {
	return dispatch => {
		dispatch(addMemberToGroupBegin());
		let addURL = new URL("http://loclhost:3009/addto/" + name);
		if (member !== null) {
			addURL.searchParams.append("username", member);
		}
		fetch(addURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => {
			dispatch(addMemberToGroupSuccess());
			// Various cases complexify local state, so we just
			// re-fetch all the groups
			dispatch(fetchGroups());
		})
		.catch(error => dispatch(addMemberToGroupFailure(error)));		
	};
}

export const removeMemberFromGroupBegin = name => ({
	type: REMOVE_MEMBER_FROM_GROUP_BEGIN,
	payload: {name: name}
});

export const removeMemberFromGroupSuccess = () => ({
	type: REMOVE_MEMBER_FROM_GROUP_SUCCESS
});

export const removeMemberFromGroupFailure = error => ({
	type: REMOVE_MEMBER_FROM_GROUP_FAILURE,
	payload: {error: error}
});

export const removeMemberFromGroup = (name, member = null) => {
	return dispatch => {
		dispatch(removeMemberFromGroupBegin());
		let removeURL = new URL("http://loclhost:3009/removefrom/" + name);
		if (member !== null) {
			removeURL.searchParams.append("username", member);
		}
		fetch(removeURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => {
			dispatch(removeMemberFromGroupSuccess());
			// Various cases complexify local state, so we just
			// re-fetch all the groups
			dispatch(fetchGroups());
		})
		.catch(error => dispatch(removeMemberFromGroupFailure(error)));		
	};
}

// TODO: Handle instructor state in a more clean way than
// just refetching on every update (maybe)
export const addInstructorToGroup = (groupName, username) => {
	return dispatch => {
		let addInstructorURL = new URL("http://localhost:3009/addinstructor");
		addInstructorURL.searchParams.append("username", username);
		addInstructorURL.searchParams.append("groupid", groupName);

		fetch(addInstructorURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			dispatch(fetchGroups());
		});
	};
}

export const removeInstructorFromGroup = (groupName, username) => {
	return dispatch => {
		let rmInstructorURL = new URL("http://localhost:3009/removeinstructor");
		rmInstructorURL.searchParams.append("username", username);
		rmInstructorURL.searchParams.append("groupid", groupName);

		fetch(rmInstructorURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			dispatch(fetchGroups());
		});
	};
}


/* DELETING ACTIONS */

export const deleteGroupBegin = () => ({
	type: DELETE_GROUP_BEGIN
});

export const deleteGroupSuccess = name => ({
	type: DELETE_GROUP_SUCCESS,
	payload: {name: name}
});

export const deleteGroupFailure = error => ({
	type: DELETE_GROUP_FAILURE,
	payload: {error: error}
});

export const deleteGroup = name => {
	return dispatch => {
		dispatch(deleteGroupBegin());
		let groupURL = new URL("http://localhost:3009/group");
		groupURL.searchParams.append("name", name);
		fetch(groupURL, {
			method: "DELETE",
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
			dispatch(deleteGroupSuccess(name));
			dispatch(fetchGroups());
		})
		.catch(error => dispatch(deleteGroupFailure(error)));
	};
}

/* LOCAL STATE CHANGING ACTIONS */

export const setActiveGroup = name => ({
	type: SET_ACTIVE_GROUP,
	payload: {name: name}
});

export const setGroupViewMode = (name, mode) => ({
	type: SET_GROUP_VIEW_MODE,
	payload: {group: name, mode: mode}
});
