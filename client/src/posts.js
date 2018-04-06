import axios from "axios/index";
var React = require('react');;
var Link = require ('react-router-dom').Link;

export default class Posts extends React.Component {

    constructor() {
        super();
        this.state = {date: new String()};
    }

    componentDidMount() {
        axios
            .get("/posts")
            .then(response => {
                this.setState({
                    date: response.data
                });
            })
            .catch(error => console.log(error));
    }

    Posts () {
        var posts = Object.values(this.state.date).map((data) => {
            return <Link to={"post/"+data.id}>{data.title}{data.content}</Link>
        })
        return (<div>{posts}</div>);
    }

    render() {
        return (
            <div className="App">
                {this.Posts ()}
            </div>
        );
    }
}