import axios from "axios/index";
var React = require('react');;

export default class Enter extends React.Component {

    constructor() {
        super();
        this.state = {date: new String()};
    }

    componentDidMount() {
        const { castle_id } = this.props.match.params

        axios
            .get(`/enter/${castle_id}`)
            .then(response => {
                this.setState({
                    date: response.data
                });
            })
            .catch(error => console.log(error));
    }

    Enter () {
        return (<div>Success entering!</div>);
    }

    render() {
        return (
            <div className="App">
                {this.Enter ()}
            </div>
        );
    }
}