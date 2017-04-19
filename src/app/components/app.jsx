import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser } from '../actions/firebase_actions';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Drawer from 'material-ui/Drawer';


import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/svg-icons/navigation/menu';


class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} href="/login" label="Login" />
    );
  }
}

class Logged extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Profile" href="/profile" />
        <MenuItem primaryText="Sign out" onTouchTap={this.props.logout} href="/"/>
  </IconMenu>
    );
  }
}



class App extends Component {

    constructor(props) {
        super(props);

        this.props.fetchUser();
        this.logOut = this.logOut.bind(this);
        this.state = {open: false};
    }

    logOut() {
        console.log(this.props);
        this.props.logoutUser().then((data) => {
      // reload props from reducer
            this.props.fetchUser();
        });
    }



    renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation
        if (currentUser && currentUser.uid) {
            return (
                <li className="dropdown">
                    <a
                      href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                      aria-haspopup="true" aria-expanded="false"
                    >
                        {currentUser.email} <span className="caret" /></a>
                    <ul className="dropdown-menu">
                        <li><Link to="/profile">Profile</Link></li>
                        <li role="separator" className="divider" />
                        <li><Link to="/logout" onClick={this.logOut}>Logout</Link></li>
                    </ul>
                </li>
            );
        } else {
            return [
                <li key={1}><Link to="/login">Login</Link></li>,
                <li key={2}><Link to="/register">Register</Link></li>,
            ];
        }
    }


  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

    render() {
        return (

            <div>
                <AppBar
                  title="Firebase & Redux boilerplate"
                  iconElementLeft={<IconButton><Menu onTouchTap={this.handleToggle} /></IconButton>}
                  iconElementRight={this.props.currentUser ? <Logged logout={this.props.logoutUser}/> : <Login />}
                />


                <div className="container">
                    {this.props.children}
                </div>

                <Drawer
                  docked={false}
                  width={200}
                  open={this.state.open}
                  onRequestChange={(open) => this.setState({open})}
                >
                  <MenuItem href="/" onTouchTap={this.handleClose}>Home</MenuItem>
                  <MenuItem href="/login" onTouchTap={this.handleClose}>Login</MenuItem>
                  <MenuItem href="/register" onTouchTap={this.handleClose}>Register</MenuItem>
                </Drawer>                
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser, logoutUser }, dispatch);
}


function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
