import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {firebase, firebaseDb} from '../../utils/firebase';
import {Link} from 'react-router';
import { fetchUser } from '../../actions/firebase_actions';

import Loading from '../helpers/loading';
import moment from 'moment';

class RecomendationsSubmit extends Component {

    constructor(props) {
        super(props);
        this.props.fetchUser();


        this.state = {
            message: '',
            text: '',
        };
    }
    componentDidMount(){
                    console.log("USR NOW RECOMEDNATIONS", this.props.currentUser);


    }

    onFormSubmit(event) {
        event.preventDefault();
        const recomendationText = this.refs.recomendation.value;
        const fireRecomendationsRef = firebaseDb.ref("recomendations").child(this.props.pefId);

                console.log("USER PASSED TO RENDER IN RECOMENDATIONS", this.props.currentUser);
                console.log("Recomendation text", recomendationText);
        if (recomendationText.length > 5) {
                  console.log("PARAMS", this.props);

            fireRecomendationsRef.push().set({
                text: recomendationText,
                author: {
                    uid: this.props.currentUser.uid,
                    name: this.props.currentUser.displayName,
                    email: this.props.currentUser.email,
                    photoURL: this.props.currentUser.photoURL,
                },
                timestamp: moment().valueOf(),
            });

            this.setState({message: '', text: ''});
        } else {
            this.setState({message: "Recomendation has to be longer than 5 symbols"});
        }
    }

    componentWillReceiveProps(nextProps){
        console.log("NEW PROPS?", nextProps);
        if (nextProps.reply) {
            var modifiedText = nextProps.reply.text+'\n by '+nextProps.reply.author.name+' on '+moment(nextProps.reply.timestamp).format('YYYY-MM-DD HH:ss');
            modifiedText = modifiedText.split('\n').map(s => `> ${s}`).join('\n');
            this.setState({text: modifiedText+"\n"+this.state.text });
        }
    }
    handleTyping(e){
        this.setState({text: e.target.value});
    }

    render() {
        if (!this.props.currentUser ) {
            return <Loading />;
        }
        console.log("REPLAY STATE", this.props.reply);
        return (
            <div className="col-md-12">
                <form id="frmProfile" role="form" onSubmit={this.onFormSubmit.bind(this)}>
                    <p>{this.state.message}</p>
                    <div className="form-group">
                        <label htmlFor="recomendation">Recomendation: </label>
                        <textarea 
                        className="form-control" rows="5" id="recomendation" 
                        ref="recomendation" name="recomendation" value={this.state.text}  onChange={this.handleTyping.bind(this)}></textarea>

                    </div>
                    
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecomendationsSubmit);