import axios from "axios/index";
import './css/posts.css';
let React = require('react');
let Link = require ('react-router-dom').Link;

export default class Posts extends React.Component {

    constructor() {
        super();
        this.state = {
            posts: '',
            users: '',
            isAuthenticated: false,
            avatars: '',
            img: new Object()
        };
    }

    componentDidMount() {

        const { post } = this.props.match.params;

        axios.all([
            axios.get(`/posts`),
            axios.get(`/addPost/heroes`),
            axios.get(`/sessionUser`),
            axios.get(`/getAvatars`)
        ])
            .then(axios.spread((post, hero, session_user, avatars) => {
                this.setState({ avatars: avatars.data });
                this.setState({ posts: post.data });
                this.setState({ users: hero.data });
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");
            }))
            .catch(error => console.log(error));
    }

    heroAvatar(hero_id){

        let hero = Object.values(this.state.avatars).map((hero) => {
            if(hero.id === hero_id){
                let avatar = './images/' + hero.fractionname + '/' + hero.path;
                try {
                    this.state.img = require(``+avatar);
                } catch (e) {
                    try {
                        avatar= './images/emptyAvatar.jpg';
                        this.state.img = require(``+avatar);
                    } catch (e) {
                        console.log('Нет фоточки((9((9(')
                    }
                }
            }
        });
        return <img src={this.state.img} style={{width: '50px'}}/>
    }

    Posts () {
        let posts = Object.values(this.state.posts).map((post) => {
            let user = Object.values(this.state.users).map((user) => {
                if(user.user === post.hero_id)
                    return <div key={user.user}>{user.name}<br/></div>
            });


            let image;
            if(post.file !== null){

                image = (
                    <Link to={"current-post/"+post.id}>
                        <img src={`/post/${post.id}/img`} style={{'width': '100%'}}/>
                    </Link>
                );
            }

            return (
                <React.Fragment>
                    <Link to={"current-post/"+post.id}>

                        <div className="avatar">{this.heroAvatar(post.hero_id)}</div>

                        <div className="userAndDate">
                            <div className="user">{user}</div>
                            <div className="date">{post.date_and_time}</div>
                        </div>

                        <div className="title">{post.title}</div>
                        <div className="content">{post.content}</div>
                    </Link>
                    <div className="image">{image}</div>
                    <hr/>
               </React.Fragment>
            )
        });
        return (<div>{posts}</div>);
    }


    AddPost(){
        return (
            <Link to={"/addPost"}><button type="button" className="postButton">Запилить пост</button></Link>
        );
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="posts">
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