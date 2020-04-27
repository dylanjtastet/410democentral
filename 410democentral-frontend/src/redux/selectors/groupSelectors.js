export const getGroupState = store => store.groups;

export const getActiveGroupID = store => getGroupState(store).activeGroup;