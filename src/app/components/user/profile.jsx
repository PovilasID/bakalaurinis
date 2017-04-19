import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';



import { fetchUser, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();
        this.state = {
            message: '',
            snackOpen: false,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();
        const email = this.refs.email.value;
        const displayName = this.refs.displayName.value;
        this.props.updateUser({ email, displayName }).then((data) => {
            if (data.payload.errorCode) {
                this.setState({ 
                    message: data.payload.errorMessage,
                    snackOpen: true,
                    });
            } else {
                this.setState({
                    message: 'Updated successfuly!',
                    snackOpen: true,
                });
            }
        }
    );
    }

      handleRequestSnackClose = () => {
        this.setState({
          snackOpen: false,
        });
      };

    render() {
        if (!this.props.currentUser) {
            return <Loading />;
        }
        return (
            <div className="col-md-6">
                <form id="frmProfile" role="form" onSubmit={this.onFormSubmit}>
                    <h2>User Profile Page</h2>
                    <div className="form-group">

                    <TextField
                        defaultValue={this.props.currentUser.email}
                        floatingLabelText="Email" 
                        id="email" ref="email" name="email"/>
                    </div>
                    <div className="form-group">
                    <TextField
                        defaultValue={this.props.currentUser.displayName}
                        floatingLabelText="Email"
                        floatingLabelText="Display name" 
                        ref="displayName" id="displayName"/>
                    </div>
                    <RaisedButton type="submit" label="Update" primary={true} />
                </form>
                <ChangePassword />
                <Snackbar
                  open={this.state.snackOpen}
                  message={this.state.message}
                  autoHideDuration={4000}
                  onRequestClose={this.handleRequestSnackClose}
                />
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, updateUser }, dispatch);
}


function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
