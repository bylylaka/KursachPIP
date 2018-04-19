import Websocket from 'react-websocket';
import axios from "axios/index";
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class ChatCastle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: new Array(),
            mes: new String()
        };
    }

    componentDidMount() {
        // this is an "echo" websocket service for testing pusposes
        this.connection = new WebSocket('ws://localhost:8080/echoCastle');
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            var newMessage = {
                hero: JSON.parse(evt.data).hero,
                heroid: '/profiles/' + JSON.parse(evt.data).heroid,
                message: JSON.parse(evt.data).message
            }
            this.state.messages.push(newMessage);
            this.setState({messages:this.state.messages});
        };
    }

    handleData(data) {
        this.state.messages.push(data)
        this.setState({ mes: data});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.connection.send(this.state.mes);
    }

    onChange = e => {
        this.setState({ mes: e.target.value });
    }


    render() {
        return (
            <div className="chat">
                { this.state.messages.map( (msg) =>
                    <div><Link to={ msg.heroid } className="hero">{ msg.hero }</Link><p>{ msg.message }</p></div> )
                }

                <form name="publish" onSubmit={this.handleSubmit}>
                    <input type="text" name="message" onChange={this.onChange}/>
                    <input type="submit" value="Отправить"/>
                </form>
            </div>
        );
    }
}