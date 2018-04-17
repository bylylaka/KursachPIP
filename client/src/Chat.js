import Websocket from 'react-websocket';
import axios from "axios/index";
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
            this.setState({
                messages: this.state.messages.concat([evt.data])
            })
        };
    }

    handleData(data) {
        this.state.messages.push(data);
        this.setState({ mes: data});
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
                <div>{ this.state.messages.map( (msg) => <p>{ msg }</p> )}</div>
            </div>
        );
    }
    else
        return(
            <div></div>
        );

}
}