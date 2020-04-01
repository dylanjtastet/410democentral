import React from "react";
import 'bulma/css/bulma.css';
import '../../general.css';
import Cookies from 'js-cookie';

import RegisterModal from "./Register";


export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {username: '', password: '', modalOpen: false};
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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

    openModal(){
        this.setState({
            modalOpen: true
        });  
    }

    closeModal(){
        this.setState({
            modalOpen: false
        });
    }

    render() {
        return(
            <div>
            <RegisterModal active={this.state.modalOpen} onClose={this.closeModal}></RegisterModal>
            <div class="center">
            <div class="container column is-one-third light-background-cblue">
                <h1 class="title ">Login</h1>
                <div class = "field">
                    <label class="label">Username</label>
                    <div class="control">
                        <input class="input"
                            name =  "username"
                            type = "text"
                            value = {this.state.username}
                            onChange = {this.handleChange}
                        />
                    </div>
                </div>

                <div class = "field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input"
                            name =  "password"
                            type = "text"
                            value = {this.state.password}
                            onChange = {this.handleChange}
                        />
                    </div>
                </div>

                <div class= "field">
                    <div class = "control">
                        <div class = "buttons">
                            <button class="button is-link" onClick={this.handleSubmit}>Login</button>
                            <button class="button is-link" onClick={this.openModal}>Register</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
        );     
    }
}