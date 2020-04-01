import React from "react";

export default class RegisterModal extends React.Component{
    constructor(props){
        super(props);
        this.emptyState = {username: '', email:'', password: '', confirmPassword: ''};
        this.state = this.emptyState;
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleClose(){
        this.setState(this.emptyState);
        this.props.onClose();
    }

    handleSubmit(){
        this.handleClose();
    }

    render() {
        let emailInputClass = (this.state.email.length < 1)? "input" : (this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))? "input is-success": "input is-danger";
        let confirmPasswordClass = (this.state.confirmPassword.length < 1)? "input" : 
                                    (this.state.confirmPassword == this.state.password)? "input is-success": "input is-danger";
        
        let passwordClass = (this.state.password.length < 1)? "input":
                            (this.state.password.length > 8)? "input is-success":
                            "input is-danger";
        return(
            <div class = {"modal" + (this.props.active? " is-active": "")}>
                <div class = "modal-background" onClick = {this.handleClose}></div>
                <div class = "modal-content">
                    <div class="box">
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
                            <label class="label">Email</label>
                            <div class="control has-icons-right">
                                <input class = {emailInputClass}
                                    name =  "email"
                                    type = "text"
                                    value = {this.state.email}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div class = "field">
                            <label class="label">Password</label>
                            <div class="control">
                                <input class={passwordClass}
                                    name =  "password"
                                    type = "password"
                                    value = {this.state.password}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div class = "field">
                            <label class = "label">Confirm Password</label>
                            <div class="control">
                                <input class = {confirmPasswordClass}
                                    name = "confirmPassword"
                                    type = "password"
                                    value = {this.state.confirmPassword}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div class= "field">
                            <div class = "control">
                                <div class = "buttons">
                                    <button class="button is-link" onClick={this.handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class = "modal-close is-large" aria-label="close" onClick={this.handleClose}></button>
            </div>
        );
    }
}