import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import Recomendations from './recomendations';
import moment from 'moment';



class PEFDetails extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();


        this.state = {
            message: '',
            pefTtitle: '',
        };
    }
    componentDidMount(){
                    console.log("USR NOW", this.props.currentUser);

      console.log("PEF ID", this.props.params);
        firebaseDb.ref("pef").child(this.props.params.userId).child(this.props.params.pefId).once('value', snap =>{
            var data = snap.val();
            this.setState({pefTtitle: "PEF "+data.pef+" l/min on "+moment(data.timestamp).format('YYYY-MM-DD HH:ss')});
            console.log("PEF DATA", data.pef);
        });
      
    }



    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.props.currentUser);
        return (
            <div className="col-md-12">
            <h1>{this.state.pefTtitle}</h1>
            <Recomendations pefId={this.props.params.pefId} />
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