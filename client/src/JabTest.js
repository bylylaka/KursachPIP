import socketIOClient  from 'socket.io-client';
var React = require('react');

export default class JabTe extends React.Component {

    constructor() {
        super()
        this.state = {
            endpoint: "http://localhost:8888" // this is where we are connecting to with sockets
        }
    }

    send = () => {
        const socket = socketIOClient(this.state.endpoint)
        socket.emit('change color', 'red')
    }

    render() {
        const socket = socketIOClient(this.state.endpoint)
        socket.on('change color', (color) => {
            console.log('Полученное сообщение: ' + color)
            alert('Полученное сообщение: ' + color);
        })

        //<h1>QQ</h1>
        return (
            <div style={{ textAlign: "center" }}>

                {/*<button onClick={() => this.send()}>Change Color</button>*/}
            </div>
        )
    }
}