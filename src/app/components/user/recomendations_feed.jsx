import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import RecomendationSumbit from './recomendations_submit';
import RecomendationItem from './recomendation_item';

import moment from 'moment';

const samplePost = {
            "author" : {
                "uid" : "UrQTSQY6OzPCx5R0o35KLYf2QZx1",
                name: "Petras",
                email: "testas@testas.pa",
                photoURL: "https://lh3.googleusercontent.com/-g-pDW_SQmxY/AAAAAAAAAAI/AAAAAAAAAAA/AAyYBF5iqeC9mwmHOMJsyc4Wbe1fiOErPg/s64-c-mo/photo.jpg",
            },
            "text" : "sdfsdfsdfsdfs",
            "timestamp" : 1495628327452
    }

class RecomendationsFeed extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();

        this.state = {
            message: '',
            allRecomendations: [],
            reply:'',
        };

    }
    handleUpdate (data) { //this.props.onUpdate(data);
    console.log(data); }
    componentDidMount(){
        var recomendationsList = '';

        
        var that = this;

        firebaseDb.ref("recomendations").child(this.props.pefId).on('value', snap => {
            var data = snap.val();

            if(data){
                recomendationsList = Object.keys(data).map(function (key) {
                    return (<div><RecomendationItem key={key} onUpdate={(data) => that.props.onCitation(data)} recomendationItem={ data[key] }/></div>);
                });
            }else{
                recomendationsList =  <div class="panel panel-default"><div class="panel-body"> There are no recomendations for this </div></div>;
            }
            that.setState({allRecomendations: recomendationsList});
        });
    }



    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.state.reply);
        return (
            <div className="col-md-12">
            {this.state.allRecomendations }
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

export default connect(mapStateToProps, mapDispatchToProps)(RecomendationsFeed);