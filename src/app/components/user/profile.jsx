import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { fetchUser, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();
        this.state = {
            message: '',
            open: false,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
      handleOpen = () => {
        this.setState({open: true});
        console.log("OPEN");
      };

      handleClose = () => {
        this.setState({open: false});
        console.log("CLOSE");

      };
    onFormSubmit(event) {
        event.preventDefault();
        const email = this.refs.email.value;
        const displayName = this.refs.displayName.value;
        this.props.updateUser({ email, displayName }).then((data) => {
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

    render() {
        if (!this.props.currentUser) {
            return <Loading />;
        }
        const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleClose}
            onClick={this.handleClose}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.handleClose}
            onClick={this.handleClose}
          />,
        ];
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
                    <div>
                        <DatePicker hintText="Portrait Dialog" />
                        <TimePicker hintText="12hr Format" />

                        <RaisedButton label="Dialog" onClick={this.handleOpen} onTouchTap={this.handleOpen} />
                        <Dialog
                          title="Dialog With Actions"
                          actions={actions}
                          modal={false}
                          open={this.state.open}
                          onRequestClose={this.handleClose}
                        >
                          The actions in this window were passed in as an array of React objects.
                        </Dialog>
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
                <ChangePassword />
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
