import axios from "axios/index";
import  { Redirect } from 'react-router-dom'
var React = require('react');

export default class Post extends React.Component {

    constructor() {
        super();
        this.state = {
            hero: '',
            title: '',
            content: '',
        };

        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeContent = this.handleChangeContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        axios
            .get(`/myHero`)
            .then(response => {
                this.setState({
                    hero: response.data
                });
            })
            .catch(error => console.log(error));
    }

    handleSubmit(e){

        e.preventDefault();

        let hero_id;
        let user = Object.values(this.state.hero).map((user) => {
            hero_id = user.id
        });

        fetch('/addPost', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.state.title,
                content: this.state.content,
                hero_id: hero_id
            })
        });
        this.props.history.push('/posts');
        //return <Redirect to='/posts'/>
    }

    handleChangeTitle(event) {
        this.setState({ title: event.target.value });
    }

    handleChangeContent(event){
        this.setState({ content: event.target.value });
    }

    AddPost(){
        return (
            <form onSubmit={this.handleSubmit} method="post">
                <div>
                    <label>Название:</label><br/>
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChangeTitle} required/><br/>
                    <br/><label>Содержимое:</label><br/>
                    <textarea name="content" value={this.state.content} onChange={this.handleChangeContent} required/>
                </div>
                <br/><button type="submit">Запилить</button>
            </form>
        );
    }

    render() {
        return (
            <div className="App">
                {this.AddPost ()}
            </div>
        );
    }
}