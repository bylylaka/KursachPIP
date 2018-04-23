import socketIOClient  from 'socket.io-client';
import axios from "axios/index";
var React = require('react');

export default class JabTe extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoint: "http://localhost:8888", // this is where we are connecting to with sockets
            isAuthenticated: false
            // sockett: socketIOClient("http://localhost:8888")
        }

        const socket = new socketIOClient("http://localhost:8888");
        socket.on('change color', (color) => {
            console.log('Полученное сообщение: ' + color);
            alert('Полученное сообщение: ' + color);
        })
    }


    componentDidMount() {
        axios
            .get(`/sessionUser`)
            .then(session_user => {
                this.setState({isAuthenticated : session_user.data });
            })
            .catch(error => console.log(error));
    }


    render() {
        // if (this.state.isAuthenticated != false) {
        //     this.state.sockett.on('change color', (color) => {
        //         console.log('Полученное сообщение: ' + color);
        //         alert('Полученное сообщение: ' + color);
        //     })
        // }

        return (
            <div style={{ textAlign: "center" }}>
                {/*<button onClick={() => this.send()}>Change Color</button>*/}
            </div>
        )
    }
}