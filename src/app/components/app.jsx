import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutUser } from '../actions/firebase_actions';
import {firebase,firebaseDb} from '../utils/firebase';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            role: 'patient',
        };
        this.props.fetchUser();
        this.logOut = this.logOut.bind(this);
    }
    componentDidMount(){
        console.log("USER LIVE", this.props.currentUser)

    }
    getRole(uid) {
        firebaseDb.ref("settings").child(uid).child("role").once('value', snap =>{
            console.log("ROLE", snap.val()== "doctor");
            //this.setState({role: snap.val()});
            return snap.val();
        });
    }

    logOut() {
        this.props.logoutUser().then((data) => {
      // reload props from reducer
            this.props.fetchUser();
        });
    }

    renderNav(currentUser){
        
        var role = firebaseDb.ref("settings").child(currentUser.uid).child("role").once('value', snap =>{
            console.log("ROLE", snap.val()== "doctor");
            role = snap.val();
        });
        console.log("ROLE", role);
        return (
            <li><Link to="/dashboard"> Dashboard</Link></li>
            );
    }

    renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation

        if (currentUser && currentUser.uid ) {
           // var userRole = getRole(currentUser.uid);
           // var dashboardURL = (userRole == "doctor")? '/doctors_dashboard' : '/dashboard'  ;
           console.log("RETURN OF FIRE DB",this.getRole(currentUser.uid));
                return (
                    <li className="dropdown">
                        <a
                          href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                          aria-haspopup="true" aria-expanded="false"
                        >
                            {currentUser.email} <span className="caret" /></a>
                        <ul className="dropdown-menu">
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to={(false)? '/doctors_dashboard' : '/dashboard'}>Dashboard</Link></li>
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

    render() {
        return (
            <div>
                <header className="navbar navbar-static-top navbar-inverse" id="top" role="banner">
                    <div className="container">
                        <div className="navbar-header">
                            <button
                              className="navbar-toggle collapsed" type="button" data-toggle="collapse"
                              data-target=".bs-navbar-collapse"
                            ><span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <Link to="/" className="navbar-brand">Oro Pulsas</Link>

                        </div>
                        <nav className="collapse navbar-collapse bs-navbar-collapse" role="navigation">
                            <ul className="nav navbar-nav">
                                
                                {(this.props.currentUser)? this.renderNav(this.props.currentUser): <li><Link to="/"> Home</Link></li>}
                
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                { this.renderUserMenu(this.props.currentUser) }
                            </ul>
                        </nav>
                    </div>
                </header>

                <div className="container">
                    {this.props.children}
                </div>
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
