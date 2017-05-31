import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import RecomendationsFeed from './recomendations_feed'
import RecomendationSumbit from './recomendations_submit'
import moment from 'moment';



class Recomendations extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();


        this.state = {
            message: '',
            reply: '',
        };
    }
    componentDidMount(){
                    console.log("USR NOW RECOMEDNATIONS", this.props.currentUser);


    }



    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.props.currentUser);
        return (
            <div className="col-md-12">
            <RecomendationsFeed onCitation={(data)=> this.setState({reply: data})} pefId={this.props.pefId}/>
            <RecomendationSumbit reply={this.state.reply} pefId={this.props.pefId}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Recomendations);