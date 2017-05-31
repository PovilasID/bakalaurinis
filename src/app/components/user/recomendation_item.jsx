import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import moment from 'moment';

const wrapStyle = {
    whiteSpace: 'pre-wrap',
};


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
    replay () {
      this.props.onUpdate(this.props.recomendationItem);
      console.log("REPLY CHILD TRIGGERED", this.props.recomendationItem);
    }

    renderHeader(author){
        return (
                <div className="panel-heading">
                    <h3 className="panel-title">{(this.props.recomendationItem.author.name)? this.props.recomendationItem.author.name : this.props.recomendationItem.author.email}
                        <button className="btn btn-default btn-xs" type="button" aria-haspopup="true" aria-expanded="false" onClick={this.replay.bind(this)}>
                             <i className="fa fa-reply" aria-hidden="true"></i> Replay
                        </button>
                    </h3>
                </div>
            );

    }

    
    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("PEF Details user ID", this.props.currentUser);
        return (
            <div className="col-md-12">
                <div className={(this.props.currentUser.uid == this.props.recomendationItem.author.uid)? "panel panel-primary text-right" : "panel panel-default" }>
                {this.renderHeader(this.props.recomendationItem.author)}
                  <div className="panel-body">
                    <div style={wrapStyle}>{this.props.recomendationItem.text}</div>
                    <br />
                    <small>
                        <cite>{moment(this.props.recomendationItem.timestamp).format('YYYY-MM-DD HH:ss')}</cite> 

                    </small>
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