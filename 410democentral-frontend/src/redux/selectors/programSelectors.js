export const getProgramState = store => store.programs;

export const getAllFetchedIDs = store => getProgramState(store).progIDs;

/* Selectors for info about currently active program */

export const getActiveProgramID = store => getProgramState(store).activeProgId;

export const getActiveProgram = store =>
	getProgramState(store).progs[getActiveProgramID(store)];

export const getActiveProgramName = store => getActiveProgram(store).name;

export const getActiveProgramLocalCode = store => getActiveProgram(store).localCode;

export const getActiveProgramRemoteCode = store => getActiveProgram(store).remoteCode;

export const currentlyEditing = store => getActiveProgram(store).editState.editing;

/* Selectors to get program info by ID */

export const getProgramFromID = (store, id) => getProgramState(store).progs[id];

export const getProgramNameFromID = (store, id) => getProgramFromID(store, id).name;

export const getProgramLocalCodeFromID = (store, id) => getProgramFromID(store, id).localCode;

export const getProgramRemoteCodeFromID = (store, id) => getProgramFromID(store, id).remoteCode;

export const isEditingFromID = (store, id) => getProgramFromID(store, id).editState.editing;