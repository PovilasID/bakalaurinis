import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from '../../utils/firebase';


import { fetchUser, fetchUserSettings, updateUser } from '../../actions/firebase_actions';
import Loading from '../helpers/loading';
import ChangePassword from './change_password';
import SubmitConditionData from './submit_condition_data';
import ConditionChart from './condition_chart';

class Dashboard extends Component {

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
    }


    render() {
        if (!this.props.currentUser && !this.props.currentUserSettings) {
            return <Loading />;
        }

        return (

            <div className="col-md-6">
                <SubmitConditionData />
                <ConditionChart />
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
