import React from "react";
import 'bulma/css/bulma.css';
import '../../general.css';
import Cookies from 'js-cookie';


export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {username: '', password: ''};
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event){
        Cookies.set("sessid", 123);
        this.props.setSessid(123);
    }

    render() {
        return(
            <div class="center">
            <div class="container column is-one-third light-background-cblue">
                <h1 class="title ">Login</h1>
                <div class = "field">
                    <label class="label">Username</label>
                    <div class="control">
                        <input class="input"
                            name =  "username"
                            type = "text"
                            value = {this.state.value}
                            onChange = {this.handleChange}
                        />
                    </div>
                </div>

                <div class = "field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input"
                            name =  "username"
                            type = "text"
                            value = {this.state.value}
                            onChange = {this.handleChange}
                        />
                    </div>
                </div>

                <div class= "field">
                    <div class = "control">
                        <button class="button is-link" onClick={this.handleSubmit}>Login</button>
                    </div>
                </div>
            </div>
            </div>
        );     
    }
}