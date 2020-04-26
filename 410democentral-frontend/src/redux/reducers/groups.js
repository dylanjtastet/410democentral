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
	SET_GROUP_VIEW_MODE
} from '../actions/actionTypes';

const initState = {
	groupNames: [],
	groups: {},
	activeGroup: "",
	fetchState: {
		inProgress: false,
		error: null
	},
	updateState: {
		name: null,
		inProgress: false,
		error: null
	},
	createState: {
		inProgress: false,
		error: null
	},
	deleteState: {
		inProgress: false,
		error: null
	}
}

const groups = (state = initState, action) => {
	switch(action.type) {

		/* FETCH ALL GROUPS */

		case FETCH_GROUPS_BEGIN:
			return {
				...state,
				fetchState: {
					...state.fetchState,
					inProgress: true,
					error: null
				}
			}

		case FETCH_GROUPS_SUCCESS: {
			const groups = action.payload.groups;
			return {
				...state,
				groupNames: groups.map(group => group._id),
				groups: groups.reduce((gs, g) => {
					gs[g._id] = {
						name: g._id,
						isInstructor: g.isInstructor,
						adminMode: false
					};
					return gs;
				}, {}),
				fetchState: {
					...state.fetchState,
					inProgress: false
				}
			}
		}

		case FETCH_GROUPS_FAILURE:
			return {
				...state,
				fetchState: {
					...state.fetchState,
					inProgress: false,
					error: action.payload.error
				}
			}


		/* CREATE GROUP */

		case CREATE_GROUP_BEGIN:
			return {
				...state,
				createState: {
					...state.createState,
					inProgress: true,
					error: null
				}
			}

		case CREATE_GROUP_SUCCESS: {
			const {name} = action.payload;
			return {
				...state,
				groupNames: [...state.groupNames, name],
				groups: {
					...state.groups,
					[name] : {
						_id: name,
						// Always true here b/c this can only be done
						// from root acct
						isInstructor: true,
						adminMode: false
					}
				},
				createState: {
					...state.createState,
					inProgress: false,
					error: null
				}
			}
		}

		case CREATE_GROUP_FAILURE:
			return {
				...state,
				createState: {
					...state.createState,
					inProgress: false,
					error: action.payload.error
				}
			}


		/* UPDATE GROUP */

		case ADD_MEMBER_TO_GROUP_BEGIN:
		case REMOVE_MEMBER_FROM_GROUP_BEGIN:
			return {
				...state,
				updateState: {
					...state.updateState,
					name: action.payload.name,
					inProgress: true,
					error: null
				}
			}

		// Ignore group state changes on success, instead refetching
		// immediately after adds/removes
		case ADD_MEMBER_TO_GROUP_SUCCESS:
		case REMOVE_MEMBER_FROM_GROUP_SUCCESS:
			return {
				...state,
				updateState: {
					...state.updateState,
					inProgress: false
				}
			}

		case ADD_MEMBER_TO_GROUP_FAILURE:
		case REMOVE_MEMBER_FROM_GROUP_FAILURE:
			return {
				...state,
				updateState: {
					...state.updateState,
					inProgress: false,
					error: action.payload.error
				}
			}


		/* DELETE GROUP */

		case DELETE_GROUP_BEGIN:
			return {
				...state,
				deleteState: {
					...state.deleteState,
					inProgress: true,
					error: null
				}
			}

		case DELETE_GROUP_SUCCESS: {
			const {name} = action.payload;
			const {[name]: removedGroup, ...remainingGroups} = state.groups;
			return {
				...state,
				groupNames: [...state.groupNames.filter(gn => gn !== name)],
				groups: remainingGroups,
				deleteState: {
					...state.deleteState,
					inProgress: false,
					error: null
				}
			}
		}

		case DELETE_GROUP_FAILURE:
			return {
				...state,
				deleteState: {
					...state.deleteState,
					inProgress: false,
					error: action.payload.error
				}
			}

		/* LOCAL STATE CHANGING ACTIONS */

		case SET_ACTIVE_GROUP:
			return {
				...state,
				activeGroup: action.payload.name
			}

		case SET_GROUP_VIEW_MODE: {
			const {group, mode} = action.payload;
			return {
				...state,
				groups: {
					...state.groups,
					[group]: {
						...state.groups[group],
						adminMode: mode
					}
				}
			}
		}

		default:
			return state;
	}
}


export default groups;
