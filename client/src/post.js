import axios from "axios/index";
var React = require('react');;

export default class Post extends React.Component {

    constructor() {
        super();
        this.state = {
            post: new String(),
            comments: new String(),
            likes: 0
        };
    }

    componentDidMount() {
        const { post } = this.props.match.params

        axios
            .get(`/post/${post}`)
            .then(response => {
                this.setState({
                    post: response.data
                });
            })
            .catch(error => console.log(error));

        axios
            .get(`/post/${post}/comments`)
            .then(response => {
                this.setState({
                    comments: response.data
                });
            })
            .catch(error => console.log(error));

        axios
            .get(`/post/${post}/likes`)
            .then(response => {
                this.setState({
                    likes: response.data
                });
            })
            .catch(error => console.log(error));
    }


    Post () {
        var post = Object.values(this.state.post).map((data) => {
            return <a key={data.id}>{data.title}{data.content}</a>
        });
        return (
            <div>{post}</div>
        )
    }

    Comments(){
        var comments = Object.values(this.state.comments).map((data) => {
            return <a key={data.id}>{data.content}<br/></a>
        });
        return (
            <div>{comments}</div>
        )
    }

    Likes(){
        return (
            <div>Лукасов: {this.state.likes.length}</div>
        )
    }

    render() {
        return (
            <div className="App">
                {this.Post ()}
                <br/>
                <hr/>
                <a>Комментарии:</a>
                {this.Comments ()}
                <br/>
                <hr/>
                {this.Likes ()}
            </div>
        );
    }
}