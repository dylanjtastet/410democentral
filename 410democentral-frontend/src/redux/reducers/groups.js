import {
	FETCH_GROUPS_BEGIN,
	FETCH_GROUPS_SUCCESS,
	FETCH_GROUPS_FAILURE,

	CREATE_GROUP_BEGIN,
	CREATE_GROUP_SUCCESS,
	CREATE_GROUP_FAILURE,

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
	createState: {
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
					...state.cats,
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

		// Currently, groups cannot be updated

		/* DELETE GROUP */

		// Currently, groups cannot be deleted

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