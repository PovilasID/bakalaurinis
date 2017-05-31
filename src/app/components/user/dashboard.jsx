import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import { submitCondition } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import SubmitConditionData from './submit_condition_data';
import ConditionSummary from './condition_summary';
import ConditionOverview from './condition_overview'

class Dashboard extends Component {

    constructor(props) {
        super(props);


        this.state = {
            message: '',
            data: [],
        };
    }

    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }

        return (

            <div className="col-md-12">
                <div className="col-md-6">
                    <SubmitConditionData />
                </div>
                <div className="col-md-6">
                    <ConditionSummary />
                </div>
                <div className="col-md-12">

                    <ConditionOverview patient={this.props.currentUser.uid} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
