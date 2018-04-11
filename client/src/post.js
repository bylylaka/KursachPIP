import axios from "axios/index";
import $ from 'jquery';
import './index.css';
import ProgressiveImage from 'react-progressive-image';
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

            post_id: ''
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
            axios.get(`/post/${post}/isPuttedLike`)
        ])
            .then(axios.spread((post, heroes, likes, hero, isPutted) => {
                this.setState({ post: post.data });
                this.setState({ heroes: heroes.data });
                this.setState({ likes: likes.data.length });
                this.setState({ hero: hero.data });
                this.setState({isPuttedLike : isPutted.data });

                if(this.state.isPuttedLike.length === 0)
                    this.setState({ classLike: 'noLike'});
                else
                    this.setState({ classLike: 'yeapLike'});
            }))
            .catch(error => console.log(error));
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

            return (
                <React.Fragment>
                    <a key={post.id}><h2>{post.title}</h2><br/>{post.content}</a>
                    <br/><br/>
                    {image}
                    <hr/>
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
        return (
            <div className="App">
                {this.Post ()}
                <a>Комментарии:</a>
                <hr/>
                <div>{ this.state.comments.map( (comment) => <p>{ comment }<hr/></p> )}</div>
                <button onClick={this.addLike} className={["likeButton", this.state.classLike].join(' ')}>Лукасов: {this.state.likes}</button>
                <br/>
                {this.AddComment ()}
                <br/><hr/>
                <Link to={"/posts"}><button type="button">Вернуться</button></Link>
            </div>
        );
    }
}