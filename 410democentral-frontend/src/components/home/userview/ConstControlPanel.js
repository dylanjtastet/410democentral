import React from "react";
import 'bulma/css/bulma.css';
import '../../../general.css';

export default class ConstControlPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {widgets: []};
        this.handleChange = this.handleChange.bind(this);
        this.onConstInit = this.onConstInit.bind(this);
        this.lastCode = "";
        this.pending = false;
        props.evalWorker.onmessage = this.onConstInit;
        props.evalWorker.onerror = (err) => console.log(err); 
    }

    handleChange(id, e){
        let val = (e.target.type === "checkbox")? e.target.checked:e.target.value;
        this.props.evalWorker.postMessage({type: "CONST_VAL", id: id, val: val});
    }
    
    onConstInit(event){
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
                    <input id={id} class="slider" step={step} min={event.data.bottom} max={event.data.top} type="range"
                            onChange ={this.handleChange.bind(this, id)}/>
                    <label for={id}>{id}</label>
 
                </div>
            );
            this.setState({widgets: append(this.state.widgets, crangeWidget)});
        }
        else if(type === "INIT_IRANGE"){
            let irangeWidget = (
                <div key={id} class="field">
                    <input id={id} class="slider" step="1" min={event.data.bottom} max={event.data.top} type="range"
                            onChange ={this.handleChange.bind(this, id)}/>
                    <label for={id}>{id}</label>
                </div>
            );
            this.setState({widgets: append(this.state.widgets, irangeWidget)})
        }
        else if(type === "INIT_BOOL"){
            let boolWidget = (
                <div key={id} class = "field">
                    <input id={id} type="checkbox" name="switchExample" class="switch" //checked={event.data.def}
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
        //Restructure this later. Only one handler so it should be in content
        //and add to a buffer of object which are transformed into widgets
        else if(type === "console"){
            this.props.setConsoleBuffer(consoleBuffer =>
                [...consoleBuffer, {level: event.data.level, data: event.data.data}]
            );
        }

        else if(type === "graph"){
            this.props.setGraph({show: true, data: event.data.data});
        }
    }

    componentDidMount() {
        // Clear buffer and then logs to make sure nothing remaining in buffer
        // makes its way into the new program's console log
        this.props.setConsoleBuffer([]);
        this.props.setLogs([]);
        this.sendWorkerInit("");
    }

    //Maybe move the webworker call to init ui widgets here
    //To avoid races
    componentDidUpdate(prevProps, prevState){
        this.sendWorkerInit(prevProps.code);
    }

    sendWorkerInit(prevCode) {
        if (prevCode !== this.props.code) {
            this.lastCode = this.props.code;
            if(!this.pending){
                setTimeout(()=>{
                    this.pending = false;
                    this.setState({widgets: []}, () => {
                        this.props.evalWorker.postMessage({
                            type: "EVAL_CONST_INIT",
                            sample: this.lastCode
                        });
                    });

                } ,500);
                this.pending = true;
            }
            
        }
    }


    render(){
        if(this.state.widgets.length > 0)
            return(
                <div class="container control-panel">
                    <h6 class = "title is-6">Adjust Constants</h6>
                        <div class ="container">
                            {this.state.widgets}
                        </div>
                </div>
            );
        
        return null;
    }

}
