import React from "react";
import * as Utils from "./Utils.js"

const nameStatus = {
    DEFAULT: 0,
    OK: 1,
    TAKEN: 2,
    PENDING: 3,
}

const submitStatus = {
    DEFAULT: 0,
    PENDING: 1,
    SUCCESS: 2,
    FAILUE: 3
}

export default class RegisterModal extends React.Component{
    constructor(props){
        super(props);
        this.emptyState = {username: '', email:'', password: '', confirmPassword: '', nstatus: nameStatus.DEFAULT, regStatus: submitStatus.DEFAULT};
        this.state = this.emptyState;
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkUsername = this.checkUsername.bind(this);
    }

    async handleChange(event){
        const name = event.target.name;
        const value = event.target.value;
        this.setState({regStatus: submitStatus.DEFAULT});
         this.setState({
            [name]: value
        }, () => {
            // Maybe only do this is username is stable for time period
            if(name === "username"){
                this.checkUsername();
            }
        });
    }

    handleClose(){
        this.setState(this.emptyState);
        this.props.onClose();
    }

    async checkUsername(){
        if(this.state.username.length < 1){
            this.setState({
                nstatus: nameStatus.DEFAULT
            });
        }
        else{
            this.setState({ nstatus: nameStatus.PENDING});
            console.log(process.env);
            let resp = await fetch(process.env.REACT_APP_BASEURL+"user/"+this.state.username);
            let val = await resp.json();
            if(val.taken){
                this.setState({nstatus: nameStatus.TAKEN});
            }
            else{
                this.setState({nstatus: nameStatus.OK})
            }
        }
    }

    async handleSubmit(){
        try{
            this.setState({regStatus: submitStatus.PENDING});
            let resp = await fetch(process.env.REACT_APP_BASEURL+"register", {
                method: 'POST',
                body: JSON.stringify({
                    "username": this.state.username,
                    "password": this.state.password,
                    "email": this.state.email
                }),
                headers: {"Content-Type": "application/json"}
            });
            let complete = await resp.json();
            if(complete){
                this.setState({regStatus: submitStatus.SUCCESS});
                setTimeout(this.handleClose(), 1000);
            }
            else{
                this.setState({regStatus: submitStatus.FAILUE});
            }
        }
        catch(err){
            //console.log(err)
            this.setState({regStatus: submitStatus.FAILURE});
        }
    }

    render() {
        let emailInputClass = (this.state.email.length < 1)? "input" : Utils.checkEmail(this.state.email)? "input is-success": "input is-danger";
        let confirmPasswordClass = (this.state.confirmPassword.length < 1)? "input" : 
                                    (this.state.confirmPassword === this.state.password)? "input is-success": "input is-danger";
        
        let passwordClass = (this.state.password.length < 1)? "input":
                            Utils.checkPassword(this.state.password)? "input is-success":
                            "input is-danger";

        let usernameClass = (this.state.nstatus === nameStatus.DEFAULT)? "input":
                            (this.state.nstatus === nameStatus.PENDING)? "input is-warning":
                            (this.state.nstatus === nameStatus.OK)? "input is-success":
                            "input is-danger"

        let isSubmitDisabled = !(Utils.checkPassword(this.state.password) 
                                && Utils.checkEmail(this.state.email) 
                                && this.state.password === this.state.confirmPassword
                                //&& this.state.nstatus == nameStatus.OK
                                && this.state.regStatus === submitStatus.DEFAULT);
        
        let errMsg = (this.state.regStatus === submitStatus.FAILUE)? <p>Registration Failed! Something must be broken.</p> : null;

        return(
            <div className={"modal" + (this.props.active? " is-active": "")}>
                <div className="modal-background" onClick = {this.handleClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control">
                                <input className={usernameClass}
                                    name =  "username"
                                    type = "text"
                                    value = {this.state.username}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control has-icons-right">
                                <input className={emailInputClass}
                                    name =  "email"
                                    type = "text"
                                    value = {this.state.email}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input className={passwordClass}
                                    name =  "password"
                                    type = "password"
                                    value = {this.state.password}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Confirm Password</label>
                            <div className="control">
                                <input className={confirmPasswordClass}
                                    name = "confirmPassword"
                                    type = "password"
                                    value = {this.state.confirmPassword}
                                    onChange = {this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="control">
                                <div className="buttons">
                                    <button className="button is-link" disabled={isSubmitDisabled} onClick={this.handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>
                        {errMsg}
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={this.handleClose}></button>
            </div>
        );
    }
}
