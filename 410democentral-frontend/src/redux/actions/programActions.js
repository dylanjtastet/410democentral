import {
	FETCH_PROGRAM_BEGIN,
	FETCH_PROGRAM_SUCCESS,
	FETCH_PROGRAM_FAILURE,
	PUSH_PROGRAM_BEGIN,
	PUSH_PROGRAM_SUCCESS,
	PUSH_PROGRAM_FAILURE,
	DELETE_PROGRAM_BEGIN,
    // eslint-disable-next-line no-unused-vars
	DELETE_PROGRAM_SUCCESS,
	DELETE_PROGRAM_FAILURE,	
	SET_ACTIVE_PROGRAM,
	CHECKOUT_REMOTE_CODE,
	EDIT_CHECKPOINT,
	PERFORM_EDIT,
	FINISH_EDITING
} from './actionTypes';

import {
	getActiveProgramID,
	getProgramFromID,
	getProgramNameFromID,
	getProgramLocalCodeFromID
} from '../selectors/programSelectors';
import { fetchCategories } from './categoryActions';

/* FETCHING ACTIONS */

export const fetchProgramBegin = id => ({
	type: FETCH_PROGRAM_BEGIN,
	payload: {id: id}
});

export const fetchProgramSuccess = (id, program) => ({
	type: FETCH_PROGRAM_SUCCESS,
	payload: {id: id, program: program}
});

export const fetchProgramFailure = error => ({
	type: FETCH_PROGRAM_FAILURE,
	payload: {error: error}
});

export const fetchProgram = (id) => {
	return (dispatch, getState) => {
		dispatch(fetchProgramBegin(id));
		if (id === "") {
			dispatch(fetchProgramFailure(Error("Cannot fetch program without ID")));
		}
		let sampleURL = new URL("http://localhost:3009/sample");
		sampleURL.searchParams.append("id", id);
		console.log("here");
		fetch(sampleURL, {
			credentials: "include"
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			dispatch(fetchProgramSuccess(id, data));
			return data;
		})
		.catch(error => dispatch(fetchProgramFailure(error)));
	};
}

export const fetchActiveProgram = () => {
	return (dispatch, getState) => {
		dispatch(fetchProgram(getActiveProgramID(getState())));
	};
}


/* PUSHING/UPDATING ACTIONS */

export const pushProgramBegin = id => ({
	type: PUSH_PROGRAM_BEGIN,
	payload: {id: id}
});

export const pushProgramSuccess = () => ({
	type: PUSH_PROGRAM_SUCCESS
});

export const pushProgramFailure = error => ({
	type: PUSH_PROGRAM_FAILURE,
	payload: {error: error}
});

export const pushLocalChanges = (
	id,
	catID = null,
	group = null,
	progUpdates = {}
) => {
	return (dispatch, getState) => {
		dispatch(pushProgramBegin(id));
		// Not sure if this validation is best placed here or within the react components
		if (id === null || id === "") {
			dispatch(fetchProgramFailure(Error("Cannot push changes to program with null ID")));
		}

		let sampleURL = new URL("http://localhost:3009/sample");
		console.log(id)
		sampleURL.searchParams.append("sample", id);
		if (catID !== null && catID !== "") {
			sampleURL.searchParams.append("category", catID);
		}
		if (group !== null && group !== "") {
			sampleURL.searchParams.append("group", group);
		}

			
		fetch(sampleURL, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				...progUpdates,
				code: getProgramLocalCodeFromID(getState(), id)
			})
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(data => {
			// Might as well always refresh the categories here
			dispatch(fetchCategories());
			dispatch(fetchProgram(id));
			dispatch(pushProgramSuccess());
			return data;
		})
		.catch(error => dispatch(pushProgramFailure(error)));
	};
}

export const pushCurrentLocalChanges = (
	catID = null,
	group = null,
	progUpdates = {}
) => {
	return (dispatch, getState) => {
		dispatch(pushLocalChanges(getActiveProgramID(getState()), catID, group, progUpdates));
	};
}

export const addNewProgram = (program, category, group, user, setCurrent) => {
	console.log("test");
	return dispatch => {
		dispatch(pushProgramBegin(null));
		let sampleURL = new URL("http://localhost:3009/sample");
		sampleURL.searchParams.append("category", category);
		sampleURL.searchParams.append("group", group);
		sampleURL.searchParams.append("user", user);
		fetch(sampleURL, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify(program)
		})
		.then(res => {
			if (!res.ok) throw Error(res.statusText);
			return res;
		})
		.then(res => res.json())
		.then(data => {
			dispatch(pushProgramSuccess(data.newId, program.code));
			dispatch(fetchCategories());
			if (setCurrent) {
				console.log("data = " + data.newId);
				dispatch(fetchProgram(data.newId));
				dispatch(setActiveProgram(data.newId));
			}
			return data;
		})
		.catch(error => dispatch(pushProgramFailure(error)));
	};
}

// TODO: Implement rename program, change program category
export const renameProgram = (id, name) => {
	return dispatch => {

	};
}

/* DELETION ACTIONS */

export const deleteProgramBegin = id => ({
	type: DELETE_PROGRAM_BEGIN,
	payload: {id: id}
});

export const deleteProgramSuccess = id => ({
	type: DELETE_PROGRAM_SUCCESS,
	payload: {id: id}
});

export const deleteProgramFailure = error => ({
	type: DELETE_PROGRAM_FAILURE,
	payload: {error: error}
});

export const deleteProgram = id => {
	return (dispatch, getState) => {
		dispatch(deleteProgramBegin(id));
		let sampleURL = new URL("http://localhost:3009/sample");

		fetch(sampleURL, {
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
			dispatch(deleteProgramSuccess(id));
			// Category tree includes stubs for each sample, so
			// we need to refresh it here
			dispatch(fetchCategories());
			return res;
		});
		//.catch(error => dispatch(deleteProgramFailure(error)));
	};
}

/* LOCAL STATE CHANGING ACTIONS */

export const setActiveProgram = id => ({
	type: SET_ACTIVE_PROGRAM,
	payload: {id: id}
});

// Editing actions below always act on active program

export const checkoutRemoteCode = () => ({
	type: CHECKOUT_REMOTE_CODE
});

export const editCheckpoint = () => ({
	type: EDIT_CHECKPOINT
});

export const finishEditing = () => ({
	type: FINISH_EDITING
});

export const performEdit = code => ({
	type: PERFORM_EDIT,
	payload: {code: code}
});
