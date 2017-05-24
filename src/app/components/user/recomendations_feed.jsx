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
        };
    }
    componentDidMount(){
        var recomendationsList = '';
        firebaseDb.ref("recomendations").child(this.props.pefId).on('value', snap => {
            var data = snap.val();
            //this.setState({allRecomendations: data});
            recomendationsList = Object.keys(data).map(function (key) {
                console.log("Recomendation item", data[key]);
                return (<div><RecomendationItem key={key} recomendationItem={ data[key] }/></div>);
            });
            this.setState({allRecomendations: recomendationsList});
            console.log("ALL RECOMENDATIONS",this.state.allRecomendations);
        });

    }


    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.props.currentUser);
        return (
            <div className="col-md-12">
            {(this.state.allRecomendations)? this.state.allRecomendations:  <div class="panel panel-default"><div class="panel-body"> There are no recomendations for this </div></div> }
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