import React from "react";
import 'bulma/css/bulma.css';
import '../../general.css';

export default class ConstControlPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {widgets: []};
        this.handleChange = this.handleChange.bind(this);
        this.onConstInit = this.onConstInit.bind(this);
        props.evalWorker.onmessage = this.onConstInit;
        props.evalWorker.onerror = (err) => console.log(err); 
        console.log(props.evalWorker);
    }

    handleChange(id, e){
        this.props.evalWorker.postMessage({type: "CONST_VAL", id: id, val: e.target.value});
    }
    
    onConstInit(event){
        console.log(event);
        let append = (lst, item) => {
            lst.push(item);
            return lst;
        };
        let type = event.data.type;
        let id = event.data.id;
        if(type === "INIT_CRANGE"){
            let step = (event.data.top - event.data.bottom)/100;
            let crangeWidget = (
                <div key={id} class="field">
                    <input id={id} class="slider is-fullwidth" step={step} min={event.data.bottom} max={event.data.top} type="range"
                            onChange ={this.handleChange.bind(this, id)}/>
                </div>
            );
            this.setState({widgets: append(this.state.widgets, crangeWidget)});
        }
        else if(type === "INIT_IRANGE"){
            let irangeWidget = (
                <div key={id} class="field">
                    <input id={id} class="slider is-fullwidth" step="1" min={event.data.bottom} max={event.data.top} type="range"
                            onChange ={this.handleChange.bind(this, id)}/>
                </div>
            );
            this.setState({widgets: append(this.state.widgets, irangeWidget)})
        }
        else if(type === "INIT_BOOL"){
            let boolWidget = (
                <div key={id} class = "field">
                    <input id={id} type="checkbox" name="switchExample" class="switch" checked={event.data.def}
                        onChange ={this.handleChange.bind(this, id)}/>
                    <label for={id}>{id}</label>
                </div>
            );
            this.setState({widgets: append(this.state.widgets, boolWidget)});
        }
        else if(type === "INIT_WRITEIN"){
            let writeinWidget = (
                <div key={id} class="field">
                     <input class="input"
                            name =  {id}
                            type = "text"
                            value = {event.data.def}
                            onChange = {this.handleChange.bind(this, id)}
                        />
                </div>
            );
            this.setState({widgets: append(this.state.widgets, writeinWidget)});
        }
    }

    //Maybe move the webworker call to init ui widgets here
    //To avoid races
    componentDidUpdate(prevProps, prevState){
        if(prevProps.code != this.props.code){
            this.setState({widgets: []});
        }
    }

    render(){
        return(
            <div class="container">
                {this.state.widgets}
            </div>
        );
    }

}