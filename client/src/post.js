import axios from "axios/index";
let React = require('react');
let Link = require ('react-router-dom').Link;

export default class Post extends React.Component {

    constructor() {
        super();
        this.state = {
            post: '',
            comments: '',
            heroes: '',
            likes: new Array(),
            comment_content: '',
            hero: '',

            like: 213
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addLike = this.addLike.bind(this);
    }

    componentDidMount() {
        const { post } = this.props.match.params;

        //////////////////////////////////////////////
        this.connection = new WebSocket(`ws://localhost:8080/post/${post}/addLike`);
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            this.setState({
                likes: [evt.data]
            })
        };
        //////////////////////////////////////////////;

        axios.all([
            axios.get(`/post/${post}`),
            axios.get(`/post/${post}/comments`),
            axios.get(`/post/${post}/likes`),
            axios.get(`/post/${post}/heroes`),
            axios.get(`/myHero`),
        ])
            .then(axios.spread((post, comments, likes, heroes, hero) => {
                this.setState({ post: post.data });
                this.setState({ comments: comments.data });
                //////////////////////////////изменить на Likes
                this.setState({ like: likes.data });
                this.setState({ heroes: heroes.data });


                this.setState({ hero: hero.data });
            }))
            .catch(error => console.log(error));
    }

    Post () {
        let post = Object.values(this.state.post).map((data) => {
            return <a key={data.id}>{data.title}<br/>{data.content}</a>
        });
        return (
            <div>{post}</div>
        )
    }

    Comments(){
        let comments = Object.values(this.state.comments).map((comment) => {
            let heroes = Object.values(this.state.heroes).map((hero) => {
                if(hero.user === comment.user_id)
                    return <a key={hero.user}>{hero.name} сказал:<br/></a>
            });
            return <a key={comment.id}>{heroes}{comment.content} - {comment.date_and_time}<hr/></a>
        });
        return (
            <div>{comments}</div>
        )
    }

    addLike(event){
        const { post } = this.props.match.params;
        this.connection.send(this.state.likes);

        /*
        axios
            .get(`/post/${post}/addLike`)
            .then()
            .catch(error => console.log(error));

        window.location.reload();
        */
    }

    Likes(){
        return (
            <button onClick={this.addLike}>Лукасов: {this.state.likes}</button>
            //<button onClick={this.addLike}>Лукасов: {this.state.likes.length}</button>
        )
    }

    handleSubmit(e){

        e.preventDefault();

        let post_id;
        let post = Object.values(this.state.post).map((post) => {
            post_id = post.id;
        });

        let user_id;
        let user = Object.values(this.state.hero).map((user) => {
            user_id = user.id
        });


        fetch({post}+'/addComment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: this.state.comment_content,
                post_id: post_id,
                user_id: user_id
            })
        });

        /*refresh page*/
        window.location.reload();
    }

    handleChange(event) {
        this.setState({ comment_content: event.target.value});
    }

    AddComment(){
        return (
            <form onSubmit={this.handleSubmit} method="post">
                <div>
                    <label>Ваш комментарий:</label><br/>
                    <textarea name="comment" value={this.state.comment_content} onChange={this.handleChange} required/>
                </div>
                <button type="submit">Отправить</button>
            </form>
        );
    }

    //{this.Likes ()}
    render() {
        return (
            <div className="App">
                {this.Post ()}
                <br/>
                <a>Комментарии:</a>
                <hr/>
                {this.Comments ()}
                <button onClick={this.addLike}>Лукасов: {this.state.likes}</button>

                <br/>
                {this.AddComment ()}
                <br/><hr/>
                <Link to={"/posts"}><button type="button">Вернуться</button></Link>
            </div>
        );
    }
}