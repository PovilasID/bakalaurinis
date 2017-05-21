import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';


import { fetchUser, fetchUserSettings, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';
import SubmitUserSettings from './submit_user_settings';
import RoleSettings from './role_settings';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();
        console.log("FULL STATE", this.state);
        console.log("FULL PROPS", this.props);


        this.state = {
            message: '',
            morning: 'disabled',
            evening: 'disabled',
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        event.preventDefault();
        const email = this.refs.email.value;
        const displayName = this.refs.displayName.value;
                console.log("USER PASSED TO RENDER", this.props.currentUser);
                console.log("USER SETTINGS PASSED TO RENDER", this.props.currentUserSettings);

        this.props.updateUser({ email, displayName}).then((data) => {
            if (data.payload.errorCode) {
                this.setState({ message: data.payload.errorMessage });
            } else {
                this.setState({
                    message: 'Updated successfuly!',
                });
            }
        }
    );
    }

    //@ TODO Merge evening and morning methods into one universal
    handleMorningReminderChange (){
       console.log(this.refs.morning_reminder.checked);
        this.refs.morning_reminder.checked?this.setState({morning:''}):this.setState({morning:'disabled'})
    console.log(this.state.morning)
    }

    handleEveningReminderChange (){
       console.log(this.refs.morning_reminder.checked);
        this.refs.evening_reminder.checked?this.setState({evening:''}):this.setState({evening:'disabled'})
    console.log(this.state.evening)
    }
    render() {
        if (!this.props.currentUser && !this.props.currentUserSettings) {
            return <Loading />;
        }
                console.log("USER PASSED TO RENDER", this.props.currentUser);
                console.log("USER SETTINGS PASSED TO RENDER", this.props.currentUserSettings);
        console.log("ALL PROP", this.props);

        return (

            <div className="col-md-6">
                <form id="frmProfile" role="form" onSubmit={this.onFormSubmit}>
                    <h2>User Profile Page</h2>
                    <p>{this.state.message}</p>
                    <br />
                    <div className="form-group">
                        <label htmlFor="email">Email: </label>
                        <input
                          type="text" defaultValue={this.props.currentUser.email}
                          className="form-control" id="email" ref="email" placeholder="Email" name="email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="displayName">Display name: </label>
                        <input
                          type="text" defaultValue={this.props.currentUser.displayName}
                          className="form-control" ref="displayName" id="displayName" placeholder="Display name"
                          name="displayName"
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
                <RoleSettings/>
                <ChangePassword />
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, fetchUserSettings, updateUser }, dispatch);
}


function mapStateToProps(state) {
    return { currentUser: state.currentUser, currentUserSettings: state.currentUserSettings};

}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
