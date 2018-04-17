import Websocket from 'react-websocket';
import axios from "axios/index";
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: new Array(),
            mes: new String(),
            isAuthenticated: false
        };
    }

    componentDidMount() {
        axios
            .get(`/sessionUser`)
            .then(session_user => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");
            })
            .catch(error => console.log(error));

        // this is an "echo" websocket service for testing pusposes
        this.connection = new WebSocket('ws://localhost:8080/echo');
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



    handleSubmit = event => {
        event.preventDefault();
        this.connection.send(this.state.mes);
    };

    onChange = e => {
        this.setState({ mes: e.target.value });
    };

render() {
    if(this.state.isAuthenticated){
        return (
            <div>
                <form name="publish" onSubmit={this.handleSubmit}>
                    <input type="text" name="message" onChange={this.onChange}/>
                    <input type="submit" value="Отправить"/>
                </form>
                <div>{ this.state.messages.map( (msg) =>
                    <p><Link to={ msg.heroid }>{ msg.hero }: { msg.message }</Link></p> )}
                    </div>
            </div>
        );
    }
    else
        return(
            <div></div>
        );

}
}