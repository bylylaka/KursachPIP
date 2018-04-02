import axios from "axios/index";
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class Castle extends React.Component {

    constructor() {
        super();
        this.state = {date: new String()};
    }

    componentDidMount() {
        const { castle } = this.props.match.params

        axios
            .get(`/castles/${castle}`)
            .then(response => {
                this.setState({
                    date: response.data
                });
            })
            .catch(error => console.log(error));
    }

    Castle () {
        var castles = Object.values(this.state.date).map((data) => {
            //return <a>{data.name}</a>
            return <Link to={"/enter/"+data.id}>Вступить в {data.name}!</Link>
        })
        return (<div>Hello! {castles}</div>)
    }

    render() {
        return (
            <div className="App">
                {this.Castle ()}
            </div>
        );
    }
}