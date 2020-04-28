import { getActiveGroupID } from "./groupSelectors";

export const getCategoryState = store => store.categories;

/* Selectors for categories of currently active group */

// See getCategoriesForGroup for info
export const getCategoriesForActiveGroup = store => getCategoriesForGroup(store, getActiveGroupID(store));

/* General category selectors */

export const getCategoryNameFromID = (store, id) => getCategoryState(store).cats[id].name;

export const getCategoryGroupFromID = (store, id) => getCategoryState(store).cats[id].group;


// Returns array of {id: ..., name:...} sorted alphabetically by name

export const getCategoriesForGroup = (store, group) => {
    let cats = getCategoryState(store).catIDs.map(catID =>({
        id: catID,
        name: getCategoryNameFromID(store, catID)
    })).filter(cat => getCategoryGroupFromID(store, cat.id) === group);
    
    return cats.sort((c0, c1) => c0.name.localeCompare(c1.name));
}