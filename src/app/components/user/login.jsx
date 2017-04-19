import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginUser, fetchUser, loginWithProvider } from '../../actions/firebase_actions';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import FontIcon from 'material-ui/FontIcon';



const styles = {
  button: {
    margin: 12,
  },
  facebook: {
    backgroundColor: "#4267b2",
    color: '#fff',
    marginRight: 12,
  },
  google:{
    backgroundColor: '#DD4B39',
    color: '#fff',
    marginRight: 12,
  },
};


class UserLogin extends Component {

    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.loginWithProvider = this.loginWithProvider.bind(this);
        this.state = {
            message: '',
        };
    }

    onFormSubmit(event) {
        event.preventDefault();

        const email = this.refs.email.value;
        const password = this.refs.password.value;
        this.props.loginUser({ email, password }).then((data) => {
            if (data.payload.errorCode) {
                this.setState({ message: data.payload.errorMessage });
            } else {
                browserHistory.push('/profile');
            }
        }
    );
    }

    loginWithProvider(provider) {
        this.props.loginWithProvider(provider).then((data) => {
            if (data.payload.errorCode) {
                this.setState({ message: data.payload.errorMessage });
            } else {
                browserHistory.push('/profile');
            }
        });
    }

    render() {
        return (
            <div className="col-md-4">
                <form id="frmLogin" role="form" onSubmit={this.onFormSubmit}>
                    <p>
                        {this.state.message}
                    </p>
                    <h2>Login</h2>
                    <div className="form-group">
                        <TextField
                          floatingLabelText="Email address"
                          id="txtEmail" ref="email" name="email"
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                          floatingLabelText="Password"
                          type="password" id="txtPass" ref="password" name="password"
                        />                        
                    </div>
                    <RaisedButton type="submit" label="Login" fullWidth={true}   primary={true}   />
                    <br />
                    <FlatButton href="/reset" label="Forgot password?" secondary={true} />

                    <h4>Login with</h4>

                    <FlatButton
                      onTouchTap={() => {
                          this.loginWithProvider('facebook');
                      }}
                      target="_blank"
                      label="Facebook"

                      style={styles.button, styles.facebook}
                      icon={<FontIcon className="fa fa-facebook"></FontIcon>}
                    />
                    <FlatButton
                      onTouchTap={() => {
                          this.loginWithProvider('google');
                      }}
                      target="_blank"
                      label="Google"

                      style={styles.button, styles.google }
                      icon={<FontIcon className="fa fa-google"></FontIcon>}
                    />

                </form>
            </div>

        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginUser,
        fetchUser,
        loginWithProvider,
    }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
