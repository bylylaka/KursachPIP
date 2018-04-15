import axios from "axios/index";
import ProgressiveImage from 'react-progressive-image';
let React = require('react');
let Link = require ('react-router-dom').Link;

export default class Posts extends React.Component {

    constructor() {
        super();
        this.state = {
            posts: '',
            users: '',
            isAuthenticated: false
        };
    }

    componentDidMount() {

        const { post } = this.props.match.params;

        axios.all([
            axios.get(`/posts`),
            axios.get(`/addPost/heroes`),
            axios.get(`/sessionUser`),
        ])
            .then(axios.spread((post, hero, session_user) => {
                this.setState({ posts: post.data });
                this.setState({ users: hero.data });
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");
            }))
            .catch(error => console.log(error));
    }

    Posts () {
        let posts = Object.values(this.state.posts).map((post) => {
            let user = Object.values(this.state.users).map((user) => {
                if(user.user === post.hero_id)
                    return <div key={user.user}>{user.name} Запостил:<br/></div>
            });


            let image;
            if(post.file !== null){
                image = (
                    <React.Fragment>
                        <ProgressiveImage src={`/post/${post.id}/img`}>
                            {src => <Link to={"current-post/"+post.id}><img src={src} alt="image" /></Link>}
                        </ProgressiveImage>
                    </React.Fragment>
                );
            }

            return (
                <React.Fragment>
                    <Link to={"current-post/"+post.id}>{user}<h2>{post.title}</h2>({post.date_and_time})<br/>{post.content}<br/></Link>
                    <br/><br/>
                    {image}
                    <hr/>
               </React.Fragment>
            )
        });
        return (<div>{posts}</div>);
    }


    AddPost(){
        return (
            <Link to={"/addPost"}><button type="button">Запилить пост</button></Link>
        );
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="App">
                    {this.AddPost ()}
                    <br/>
                    <hr/>
                    {this.Posts ()}
                </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }
}