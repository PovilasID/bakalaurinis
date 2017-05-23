import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import ConditionChart from './condition_chart';



class PEFDetails extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();


        this.state = {
            message: '',
        };
    }
    componentDidMount(){
      console.log("PEF ID", this.props.params.id);
      
    }



    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.props.currentUser);
        return (

            <div className="col-md-12">
                
            <h1>PEF DATA</h1>
            </div>
        );
    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchUser }, dispatch);
}

function mapStateToProps(state) {
    return { currentUser: state.currentUser };
}

export default connect(mapStateToProps, mapDispatchToProps)(PEFDetails);