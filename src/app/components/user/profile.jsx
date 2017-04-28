import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';


import { fetchUser, fetchUserSettings, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();
        this.props.fetchUserSettings("IInlc8u3IabsEZIOaVMXlvO9EjA2");
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
                    <div className="user-prefs">
                      <label class="PEF">
                        <input class="form-check-input" type="checkbox" value="pef"/>
                        PEF
                      </label>
                      <label class="FEV1">
                        <input class="form-check-input" type="checkbox" value="FEV1"/>
                        FEV1
                      </label>
                    </div>
                    <div className="row">
                      <div className="col-lg-6">
                        <label class="Morning"> Morning reminders
                        <div className="input-group">
                          <span className="input-group-addon">
                            <input type="checkbox" ref="morning_reminder"  onChange={this.handleMorningReminderChange.bind(this)} aria-label="Checkbox for following text input"/>
                          </span>
                          <input type="text" className="form-control" aria-label="Text input with checkbox" disabled={this.state.morning}/>
                        </div>
                        </label>
                      </div>
                      <div className="col-lg-6">
                      <label class="Morning"> Evening reminders
                        <div className="input-group">
                          <span className="input-group-addon">
                            <input type="checkbox" ref="evening_reminder" onChange={this.handleEveningReminderChange.bind(this)} aria-label="Radio button for following text input"/>
                          </span>
                          <input type="text" className="form-control" aria-label="Text input with radio button"disabled={this.state.evening} />
                        </div>
                        </label>
                      </div>
                    </div>


                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
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
