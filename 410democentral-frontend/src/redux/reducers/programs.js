import {hashProgCode} from "../util"

import {
	FETCH_PROGRAM_BEGIN,
	FETCH_PROGRAM_SUCCESS,
	FETCH_PROGRAM_FAILURE,
	PUSH_PROGRAM_BEGIN,
	PUSH_PROGRAM_SUCCESS,
	PUSH_PROGRAM_FAILURE,
	DELETE_PROGRAM_BEGIN,
	DELETE_PROGRAM_SUCCESS,
	DELETE_PROGRAM_FAILURE,
	SET_ACTIVE_PROGRAM,
	CHECKOUT_REMOTE_CODE,
	EDIT_CHECKPOINT,
	PERFORM_EDIT,
	FINISH_EDITING
} from '../actions/actionTypes';

const initState = {
	progIDs: [""],
	progs: {"": {
		name: "Welcome",
		isEditable: true,
		editState: {
			editing: false,
			hasEdits: false,
			// eslint-disable-next-line no-unused-vars
			lastRemoteHash: null
		},
		localCode: "",
		remoteCode: "",
		hiddenCode: ""
	}},
	activeProgId: "",
	fetchState: {
		id: null,
		inProgress: false,
		error: null
	},
	pushState: {
		id: null,
		inProgress: false,
		error: null
	},
	deleteState: {
		id: null,
		inProgress: false,
		error: null
	}
}

const activeRemoteCodeHash = (state) => 
	hashProgCode(state.progs[state.activeProgId].remoteCode);


const programs = (state = initState, action) => {
	switch(action.type) {
		/* FETCH state changes */
		case FETCH_PROGRAM_BEGIN:
			return {
				...state,
				fetchState: {
					...state.fetchState,
					id: action.payload.id,
					inProgress: true,
					error: null
				}
			}
		case FETCH_PROGRAM_SUCCESS: {
			const {id, program} = action.payload;
			const isNew = !state.progIDs.includes(id);
			//console.log("isNew = " + isNew);
			let new_state = {
				...state,
				progIDs: isNew ? [...state.progIDs, id] : state.progIDs,
				progs: {
					...state.progs,
					[id]: {
						...state.progs[id],
						name: program.name,
						category: program.category,
						isEditable: program.isEditable,
						editState: isNew ? {
							editing: false,
							hasEdits: false,
							lastRemoteHash: null
						} : state.progs[id].editState,
					}
				},
				fetchState: {
					...state.fetchState,
					inProgress: false,
				}
			}
			return setCodeState(new_state, id, program.code, isNew);
		}

		case FETCH_PROGRAM_FAILURE:
			return {
				...state,
				fetchState: {
					...state.fetchState,
					inProgress: false,
					error: action.payload.error
				}
			}

		/* PUSH (create/update program) state changes */
		
		case PUSH_PROGRAM_BEGIN:
			return {
				...state,
				pushState: {
					...state.pushState,
					id: action.payload.id,
					inProgress: true,
					error: null
				}
			}
		case PUSH_PROGRAM_SUCCESS:
			return {
				...state,
				pushState: {
					...state.pushState,
					inProgress: false
				}
			}

		case PUSH_PROGRAM_FAILURE:
			return {
				...state,
				pushState: {
					...state.pushState,
					inProgress: false,
					error: action.payload.error
				}
			}

		/* DELETE (remove from server) state changes */

		case DELETE_PROGRAM_BEGIN:
			return {
				...state,
				deleteState: {
					...state.deleteState,
					id: action.payload.id,
					inProgress: true,
					error: null
				}
			}

		case DELETE_PROGRAM_SUCCESS: {
			const {id} = action.payload;
			const {[id]: removedProg, ...remainingProgs} = state.progs;
			return {
				...state,
				progIDs: [...state.progIDs.filter(progID => progID !== id)],
				progs: remainingProgs,
				deleteState: {
					...state.deleteState,
					inProgress: false,
					error: null
				}
			}
		}

		case DELETE_PROGRAM_FAILURE:
			return {
				...state,
				deleteState: {
					...state.deleteState,
					inProgress: false,
					error: action.payload.error
				}
			}

		/* Local state changes */

		case SET_ACTIVE_PROGRAM:
			return {
				...state,
				activeProgId: action.payload.id
			}

		case CHECKOUT_REMOTE_CODE: {
			const id = state.activeProgId;
			return setLocalCodeState(
				state, state.activeProgId, state.progs[id].remoteCode
			);
		}

		case EDIT_CHECKPOINT: {
			const id = state.activeProgId;
			return {
				...state,
				progs: {
					...state.progs,
					[id] : {
						...state.progs[id],
						editState: {
							...state.progs[id].editState,
							editing: true,
							lastRemoteHash: activeRemoteCodeHash(state)
						}
					}
				}
			}
		}

		case PERFORM_EDIT:
			return setLocalCodeState(
				state, state.activeProgId, action.payload.code
				);

		case FINISH_EDITING: {
			const id = state.activeProgId;
			return {
				...state,
				progs: {
					...state.progs,
					[id] : {
						...state.progs[id],
						editState: {
							...state.progs[id].editState,
							editing: false,
							lastRemoteHash: null
						}
					}
				}
			}
		}
		default:
			return state;
	}
}

// Changes to localCode/remoteCode should ONLY occur via these three functions

// Behavior here: always updates remoteCode to newCode. In addition, 
// if hasEdits is false (prev local code hadn't been changed since 
// last fetch) or forceUpdateLocal is true, localCode will be updated as well
const setCodeState = (state, id, newCode, forceUpdateLocal = false) => {
	//console.log("here2")
	let new_state = setRemoteCodeState(state, id, newCode);
	if (forceUpdateLocal || !state.progs[id].editState.hasEdits) {
		new_state = setLocalCodeState(new_state, id, newCode);
	}
	return new_state;
}

// localCode should ONLY be updated via this function to 
// ensure hasEdits invariant remains consistent
const setLocalCodeState = (state, id, newLocalCode) => {
	return {
		...state,
		progs: {
			...state.progs,
			[id] : {
				...state.progs[id],
				localCode: newLocalCode,
				editState: {
					...state.progs[id].editState,
					hasEdits: newLocalCode !== state.progs[id].remoteCode
				}
			}
		}
	}
}

// Similarly, remoteCode should ONLY be updated via this function
const setRemoteCodeState = (state, id, newRemoteCode) => {
	return {
		...state,
		progs: {
			...state.progs,
			[id] : {
				...state.progs[id],
				remoteCode: newRemoteCode,
				editState: {
					...state.progs[id].editState,
					hasEdits: newRemoteCode !== state.progs[id].localCode
				}
			}
		}
	}
}

export default programs;
