import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import { submitCondition } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import SubmitConditionData from './submit_condition_data';
import ConditionSummary from './condition_summary';
import ConditionOverview from './condition_overview'

class DoctorConditionOverview extends Component {

    constructor(props) {
        super(props);


        this.state = {
            message: '',
            data: [],
            patientsList: [],
        };
    }

    componentDidMount(){
        console.log("DOCTOR ID", this.props);
        let patientsList = '';
        firebaseDb.ref("registrations").child(this.props.doctor).child("patients").on('value', snap =>{
            var data = snap.val();
            console.log("Patients", snap.val());
            patientsList = Object.keys(data).map(function (key) {
                console.log("Patients name", data[key].name);
                return (
                    <div key={key}>
                        <h2>{data[key].name}</h2>
                        <ConditionOverview patient={key} />
                    </div>
                    );
            });
            this.setState({patientsList: patientsList});
        });
        console.log("Condition overviews",patientsList);
    }
    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }

        return (

            <div className="col-md-12">
                <div className="col-md-12">
                    {this.state.patientsList}
                </div>
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ submitCondition }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorConditionOverview);
