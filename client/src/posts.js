import axios from "axios/index";
let React = require('react');
let Link = require ('react-router-dom').Link;

export default class Posts extends React.Component {

    constructor() {
        super();
        this.state = {
            posts: '',
            users: ''
        };
    }

    componentDidMount() {

        const { post } = this.props.match.params

        axios.all([
            axios.get(`/posts`),
            axios.get(`/addPost/heroes`),
        ])
            .then(axios.spread((post, hero) => {
                this.setState({ posts: post.data });
                this.setState({ users: hero.data });
            }))
            .catch(error => console.log(error));
    }

    Posts () {
        let posts = Object.values(this.state.posts).map((post) => {
            let user = Object.values(this.state.users).map((user) => {
                if(user.user === post.user_id)
                    return <a key={user.user}>{user.name} Запостил:<br/></a>
            });
            return <Link to={"post/"+post.id}>{user}{post.title}({post.date_and_time})<br/>{post.content}<br/><hr/></Link>
        });
        return (<div>{posts}</div>);
    }


    AddPost(){
        return (
            <Link to={"/addPost"}><button type="button">Запилить пост</button></Link>
        );
    }

    render() {
        return (
            <div className="App">
                {this.Posts ()}
                {this.AddPost ()}
            </div>
        );
    }
}