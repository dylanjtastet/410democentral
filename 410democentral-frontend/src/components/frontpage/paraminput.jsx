import React from 'react';

export default function Paraminput(props) {
    const parameters = props.parameters
    
    const handleStartSizeChange = function(event) {
        let end_size = props.parameters.end_size;
        let num_steps = props.parameters.num_steps;
        props.setParameters({start_size: event.target.value, end_size: end_size, num_steps: num_steps})
    }

    const handleEndSizeChange = function(event) {
        let start_size = props.parameters.start_size;
        let num_steps = props.parameters.num_steps;
        props.setParameters({start_size: start_size, end_size: event.target.value, num_steps: num_steps})
    }

    const handleNumStepsChange = function(event) {
        let start_size = props.parameters.start_size;
        let end_size = props.parameters.end_size;
        props.setParameters({start_size: start_size, end_size: end_size, num_steps: event.target.value})
    }

    let param_insert

    if (props.input==="none") {
        param_insert=<span></span>;
    } else if (props.input==="array") {
        param_insert = 
        <div className="columns">
            <label className="column">Starting Array Length:
                <input className="input" type="number" value={props.parameters.start_size} onChange={handleStartSizeChange}></input>
            </label>
            <label className="column">Ending Array Length:
                <input className="input" type="number" value={props.parameters.end_size} onChange={handleEndSizeChange}></input>
            </label>
            <label className="column">Number of Data Points:
                <input className="input" type="number" value={props.parameters.num_steps} onChange={handleNumStepsChange}></input>
            </label>
            <span className="column is-one-third"></span>
        </div>
    } else {
        param_insert = <span></span>
    }

    return <div className="paraminputs">{param_insert}</div>
}