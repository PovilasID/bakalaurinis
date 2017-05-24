import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import moment from 'moment';



class RecomendationItem extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();


        this.state = {
            message: '',
        };
    }
    componentDidMount(){
                    console.log("USR NOW RECOMEDNATION ITEM", this.props.currentUser);
                    console.log("RECOMEDNATION ITEM", this.props);



    }


    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.props.currentUser);
        return (
            <div className="col-md-12">
                <div className={(this.props.currentUser.uid == this.props.recomendationItem.author.uid)? "panel panel-primary text-right" : "panel panel-defult" }>
                  <div className="panel-heading">
                    <h3 className="panel-title">{(this.props.recomendationItem.author.name)? this.props.recomendationItem.author.name : this.props.recomendationItem.author.email}</h3>
                  </div>
                  <div className="panel-body">
                    {this.props.recomendationItem.text}
                  </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecomendationItem);