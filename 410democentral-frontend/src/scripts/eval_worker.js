//The worker is going to have to be a little stateful for our illusion to work
let constVals = {};

// These functions' names are the api available in the samples.
// So the functions must be named.
// Every function should handle the case where no input is returned
// If the functions are queried in execute mode (doFetch = false) and the
// value is not yet available in constVals, return the default

function get_ui_fns(doFetch){
    function resolveValueHelper(ename, id, params){
        let val = params.def;
        if(doFetch){
            constVals[id] = def;
            postMessage({...params, id: id, type: ename});
        }
        else{
            val = constVals[id];
        }
        return val;
    }
    return [
        function continuousRange(bottom, top, id, def=(bottom+top)/2){
            return resolveValueHelper("INIT_CRANGE", id, {bottom: bottom, top: top, def: def});
        },
        function integerRange(bottom, top, id, def = Math.floor((bottom+top)/2)){
            return resolveValueHelper("INIT_IRANGE", id, {bottom: bottom, top: top, def: def});
        },
        function boolean(id, def=false){
            return resolveValueHelper("INIT_BOOL", id, {def: def});
        },
        function writtenValue(id, def=1){
            return resolveValueHelper("INIT_WRITEIN", id, {def: def});
        }
    ];
}

// window.console = {
//     info: postMessage({type: "console", level: "info"}),
//     log: postMessage({type: "console", level: "log"}),
//     warn: postMessage({type: "console", level: "warn"}),
//     error: postMessage({type: "console", level: "error"})
// };

//Extract the "initvars" from the sample code and run it only
//and bind the api functions to its scope
function eval_const_init(sample){
    //Clear the const vals when this is called again.
    //Remember to call eval_const_init again to get the new ui widgets
    //if the code sample is edited.
    constVals = [];
    let ui_fns = get_ui_fns(false);
    (Function(...ui_fns.map(x => x.name),"var initvars; return initvars;"+sample))(ui_fns)();
}

//Run the entire sample (including 'initvars') and bind the 
//Api functions to its scope
function eval_all(sample){
    let ui_fns = get_ui_fns(true);
    Function(...ui_fns.map(x=>x.name), sample)(ui_fns);
}


onmessage = function(event){
    if(event.data.type === "EVAL_CONST_INIT"){
        eval_const_init(event.data.sample)();
    }
    else if(event.data.type === "EVAL_ALL"){
        eval_all(event.data.sample);
    }
    else if(event.data.type === "CONST_VAL"){
        if(constVals.length > event.data.id){
            constVals[event.data.id] = event.data.val;
        }
    }
} 