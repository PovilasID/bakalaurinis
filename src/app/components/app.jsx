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

  render() {
    return (
      <FlatButton {...this.props} href="/login" label="Login" />
    );
  }
}

class Logged extends Component {

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
        this.state = {drawerOpen: false};
    }

    logOut() {
        console.log(this.props);
        this.props.logoutUser().then((data) => {
      // reload props from reducer
            this.props.fetchUser();
        });
    }


  handleDrawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});

  handleDrawerClose = () => this.setState({drawerOpen: false});

    render() {
        return (

            <div>
                <AppBar
                  title="Firebase & Redux boilerplate"
                  iconElementLeft={<IconButton><Menu onTouchTap={this.handleDrawerToggle} /></IconButton>}
                  iconElementRight={this.props.currentUser ? <Logged logout={this.props.logoutUser}/> : <Login />}
                />


                <div className="container">
                    {this.props.children}
                </div>

                <Drawer 
                  docked={false}
                  width={200}
                  open={this.state.drawerOpen}
                  onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
                >
                  <MenuItem href="/" onTouchTap={this.handleDrawerClose}>Home</MenuItem>
                  <MenuItem href="/login" onTouchTap={this.handleDrawerClose}>Login</MenuItem>
                  <MenuItem href="/register" onTouchTap={this.handleDrawerClose}>Register</MenuItem>
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
