import axios from "axios/index";
import timer from 'react-timer-hoc';
var React = require('react');

export default class Enter extends React.Component {

    constructor() {
        super();
        this.state = {
            data: '',
            seconds: 4
        };
    }

    componentDidMount() {
        const { castle_id } = this.props.match.params


        axios.all([
            axios.get(`/enter/${castle_id}`),
        ])
            .then(axios.spread((enter) => {
                this.setState({ data: enter.data });
            }))
            .catch(error => console.log(error));

        this.intervalId = setInterval(this.Redirect.bind(this), 1000);
    }

    componentWillMount() {
        setTimeout(() => {
            window.history.forward()
        }, 0);
        window.onunload=function(){null};
    }



    componentWillUnmount(){
        clearInterval(this.intervalId);
    }

    Enter () {
        return (<div>Success entering! Redirect after {this.state.seconds} seconds...</div>);
    }

    Redirect() {
        this.setState({
            seconds: this.state.seconds - 1
        });
        if(this.state.seconds === 0)
            this.props.history.push("/myCastle");
    }



    render() {
        return (
            <div className="App">
                {this.Enter ()}
            </div>
        );
    }
}


