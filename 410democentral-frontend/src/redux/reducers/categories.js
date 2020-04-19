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
} from '../actions/actionTypes';

const initState = {
	catIDs: [],
	cats: {},
	catTree: [],
	fetchArrayState: {
		inProgress: false,
		error: null
	},
	fetchTreeState: {
		inProgress: false,
		error: null
	},
	createState: {
		inProgress: false,
		error: null
	},
	updateState: {
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

const categories = (state = initState, action) => {
	switch(action.type) {

		/* FETCH ALL */

		case FETCH_CATEGORY_ARRAY_BEGIN:
			return {
				...state,
				fetchArrayState: {
					...state.fetchArrayState,
					inProgress: true,
					error: null
				}
			}

		case FETCH_CATEGORY_ARRAY_SUCCESS: {
			const catArray = action.payload.catArray;
			return {
				...state,
				catIDs: catArray.map(cat => cat._id),
				cats: catArray.reduce((cts, cat) => {
					cts[cat._id] = {
						name: cat.name,
						parent: cat.parent,
						group: cat.group
					};
					return cts;
				}, {}),
				fetchArrayState: {
					...state.fetchArrayState,
					inProgress: false
				}
			}
		}

		case FETCH_CATEGORY_ARRAY_FAILURE:
			return {
				...state,
				fetchArrayState: {
					...state.fetchArrayState,
					inProgress: false,
					error: action.payload.error
				}
			}

		case FETCH_CATEGORY_TREE_BEGIN:
			return {
				...state,
				fetchTreeState: {
					...state.fetchTreeState,
					inProgress: true,
					error: null
				}
			}

		case FETCH_CATEGORY_TREE_SUCCESS:
			return {
				...state,
				catTree: action.payload.catTree,
				fetchTreeState: {
					...state.fetchTreeState,
					inProgress: false
				}
			}

		case FETCH_CATEGORY_TREE_FAILURE:
			return {
				...state,
				fetchTreeState: {
					...state.fetchTreeState,
					inProgress: false,
					error: action.payload.error
				}
			}


		/* CREATE CATEGORY */

		case CREATE_CATEGORY_BEGIN:
			return {
				...state,
				createState: {
					...state.createState,
					inProgress: true,
					error: null
				}
			}

		case CREATE_CATEGORY_SUCCESS: {
			const {id, name, parent, group} = action.payload;
			return {
				...state,
				catIDs: [...state.catIDs, id],
				cats: {
					...state.cats,
					[id] : {
						name: name,
						parent: parent,
						group: group
					}
				},
				createState: {
					...state.createState,
					inProgress: false,
					error: null
				}
			}
		}

		case CREATE_CATEGORY_FAILURE:
			return {
				...state,
				createState: {
					...state.createState,
					inProgress: false,
					error: action.payload.error
				}
			}


		/* UPDATE CATEGORY */

		case UPDATE_CATEGORY_BEGIN:
			return {
				...state,
				updateState: {
					...state.updateState,
					id: action.payload.id,
					inProgress: true,
					error: null
				}
			}

		case UPDATE_CATEGORY_SUCCESS: {
			const {id, name, parent, group} = action.payload;
			return {
				...state,
				cats: {
					...state.cats,
					[id] : {
						...state.cats[id],
						name: name,
						parent: parent,
						group: group
					}
				},
				updateState: {
					...state.updateState,
					inProgress: false,
					error: null
				}
			}
		}

		case UPDATE_CATEGORY_FAILURE:
			return {
				...state,
				updateState: {
					...state.updateState,
					inProgress: false,
					error: action.payload.error
				}
			}

		/* DELETE CATEGORY */

		case DELETE_CATEGORY_BEGIN:
			return {
				...state,
				deleteState: {
					...state.deleteState,
					id: action.payload.id,
					inProgress: true,
					error: null
				}
			}

		// This is incorrect, deletion is recursive
		// Should remove - fetch fixes state anyways?
		case DELETE_CATEGORY_SUCCESS: {
			const {id} = action.payload;
			const {[id]: removedCat, ...remainingCats} = state.cats;
			return {
				...state,
				catIDs: [...state.catIDs.filter(catID => catID != id)],
				cats: remainingCats,
				deleteState: {
					...state.deleteState,
					inProgress: false,
					error: null
				}
			}
		}

		case DELETE_CATEGORY_FAILURE:
			return {
				...state,
				deleteState: {
					...state.deleteState,
					inProgress: false,
					error: action.payload.error
				}
			}

		default:
			return state;
	}
}


export default categories;