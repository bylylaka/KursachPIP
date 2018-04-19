import axios from "axios/index";
import $ from 'jquery';
import './css/index.css';
import ProgressiveImage from 'react-progressive-image';
import './css/posts.css';
let React = require('react');
let Link = require ('react-router-dom').Link;

export default class Post extends React.Component {

    constructor() {
        super();
        this.state = {
            post: '',
            comments: new Array(),
            heroes: '',
            likes: '',
            isPuttedLike: '',
            putCounter: 0,
            classLike: '',
            comment: new String(),
            hero: '',
            post_id: '',
            isAuthenticated: false,
            avatars: '',
            img: new Object()
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addLike = this.addLike.bind(this);
    }

    componentDidMount() {
        const { post } = this.props.match.params;

        this.connection = new WebSocket(`ws://localhost:8080/post/${post}/addComment`);
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            this.setState({
                comments: this.state.comments.concat([evt.data])
            })
        };

        axios.all([
            axios.get(`/current-post/${post}`),
            axios.get(`/post/${post}/heroes`),
            axios.get(`/post/${post}/likes`),
            axios.get(`/myHero`),
            axios.get(`/post/${post}/isPuttedLike`),
            axios.get(`/sessionUser`),
            axios.get(`/getAvatars`)
        ])
            .then(axios.spread((post, heroes, likes, hero, isPutted, session_user, avatars) => {
                this.setState({ avatars: avatars.data });
                this.setState({ post: post.data });
                this.setState({ heroes: heroes.data });
                this.setState({ likes: likes.data.length });
                this.setState({ hero: hero.data });
                this.setState({isPuttedLike : isPutted.data });
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");

                if(this.state.isPuttedLike.length === 0)
                    this.setState({ classLike: 'noLike'});
                else
                    this.setState({ classLike: 'yeapLike'});
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

    Post () {
        let post = Object.values(this.state.post).map((post) => {
            this.state.post_id = post.id;

            let image;
            if(post.file !== null){
                image = (
                    <React.Fragment>
                        <ProgressiveImage src={`/post/${post.id}/img`}>
                            {src => <img src={src} alt="image"/>}
                        </ProgressiveImage>
                    </React.Fragment>
                );
            }

            let user_name;
            let user = Object.values(this.state.heroes).map((user) => {
                if(user.user === post.hero_id)
                    user_name = user.name;
            });

            return (
                <React.Fragment>
                    <div className="avatar">{this.heroAvatar(post.hero_id)}</div>

                    <div className="userAndDate">
                        <div className="user">{user_name}</div>
                        <div className="date">{post.date_and_time}</div>
                    </div>

                    <div className="title">{post.title}</div>
                    <div className="content">{post.content}</div>
                <div className="image">{image}</div>
                </React.Fragment>
            );
        });

        return (
            <div>{post}</div>
        )
    }


    addLike(){
        /*********for front********/
        if(this.state.isPuttedLike.length === 0)
            if(this.state.putCounter % 2 === 0){
                this.setState({ likes: this.state.likes + 1});
                this.setState({ classLike: 'yeapLike'});
                this.setState({ putCounter: this.state.putCounter + 1});
            }

            else {
                this.setState({ likes: this.state.likes - 1});
                this.setState({ classLike: 'noLike'});
                this.setState({ putCounter: this.state.putCounter + 1});
            }
        else
        if(this.state.putCounter % 2 === 0){
            this.setState({ likes: this.state.likes - 1});
            this.setState({ classLike: 'noLike'});
            this.setState({ putCounter: this.state.putCounter + 1});
        }

        else {
            this.setState({ likes: this.state.likes + 1});
            this.setState({ classLike: 'yeapLike'});
            this.setState({ putCounter: this.state.putCounter + 1});
        }


        /*********for back********/
        const { post } = this.props.match.params;

        let user_id;
        let user = Object.values(this.state.hero).map((user) => {
            user_id = user.id
        });

        $.ajax({
            type: 'GET',
            url: `/post/${post}/addLike`,
            success: function (data) {}
        })
    }

    handleSubmit(event){
        event.preventDefault();
        this.connection.send(this.state.comment);
    }

    handleChange(event) {
        this.setState({ comment: event.target.value});
    }

    AddComment(){
        return (
            <form onSubmit={this.handleSubmit} method="post">
                <div>
                    <label>Ваш комментарий:</label><br/>
                    <textarea name="comment" onChange={this.handleChange} required/>
                </div>
                <button type="submit">Отправить</button>
            </form>
        );
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="post">
                    {this.Post ()}
                    <button onClick={this.addLike} className={["likeButton", this.state.classLike].join(' ')}>Лукасов: {this.state.likes}</button>
                    <br/>
                    <hr/>
                    <a>Комментарии:</a>
                    <hr/>
                    <div>{ this.state.comments.map( (comment) => <p>{ comment }<hr/></p> )}</div>
                    <br/>
                    {this.AddComment ()}
                    <br/><hr/>
                    <Link to={"/posts"}><button type="button">Вернуться</button></Link>
                </div>
            );
        }
        else
            return(
                <div></div>
            );
    }
}