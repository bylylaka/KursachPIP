import axios from "axios/index";
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class AllCastles extends React.Component {

    constructor() {
        super();
        this.state = {date: new String()};
    }

    componentDidMount() {
        axios
            .get("/castle")
            .then(response => {
                this.setState({
                    date: response.data
                });
            })
            .catch(error => console.log(error));
    }

    AllCastles() {
        var castles = Object.values(this.state.date).map((data) => {
            return <Link to={"castles/"+data.name}>Castle {data.name}</Link>
        })
        return (<div>{castles}</div>);
    }

    render() {
        return (
            <div className="App">
                {this.AllCastles()}
            </div>
        );
    }
}