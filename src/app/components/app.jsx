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
            currentUserUID: '',
        };
        this.props.fetchUser();
        this.logOut = this.logOut.bind(this);
        this.getRole = this.getRole.bind(this);


    }
    componentWillMount(){
        console.log("USER LIVE", this.props.currentUser);
        if (this.props.currentUser) {
            console.log("USER ALIVE");
        } else {
            console.log("USER DEAD");
        }

    }
    getRole(uid) {
        let roleState = firebaseDb.ref("settings").child(uid).child("role").on('value', snap =>{
            console.log("ROLE", snap.val()== "doctor");
            //this.setState({role: snap.val()});
        });
        return roleState;
    }

    logOut() {
        this.props.logoutUser().then((data) => {
      // reload props from reducer
            this.props.fetchUser();
        });
    }

    renderNav(currentUser){
        //this.setState({currentUserUID: currentUser.uid});
       // this.getRole(currentUser.uid);
        return (
            <li><Link to={(this.props.currentUser.role == 'doctor')? '/doctors_dashboard' : '/dashboard'}> Dashboard</Link></li>
            );
    }

    renderUserMenu(currentUser) {
    // if current user exists and user id exists than make user navigation

        if (currentUser && currentUser.uid) {
           // var userRole = getRole(currentUser.uid);
           // var dashboardURL = (userRole == "doctor")? '/doctors_dashboard' : '/dashboard'  ;
           //console.log("RETURN OF FIRE DB",this.getRole(currentUser.uid));
                return (
                    <li className="dropdown">
                        <a
                          href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                          aria-haspopup="true" aria-expanded="false">
                            {currentUser.email} <span className="caret" /></a>
                        <ul className="dropdown-menu">
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/doctors_dashboard">Dashboard</Link></li>
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
        if (this.props.currentUser ) {
            //this.getRole(this.props.currentUser.uid);
        }
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
