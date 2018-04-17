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

        /*


        title: this.state.title,
        content: this.state.content,
        hero_id: hero_id
        */

        //console.log(this.uploadInput.files[0].name);

        let hero_id;
        let user = Object.values(this.state.hero).map((user) => {
            hero_id = user.id
        });

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);


        data.append('title', this.state.title);
        data.append('content', this.state.content);
        data.append('hero_id', hero_id);


        axios
            .post(`/addPost`, data)
            .then(response => {
               console.log("done");
            })
            .catch(error => console.log(error));


        this.props.history.push('/posts');
    }

    handleChangeTitle(event) {
        this.setState({ title: event.target.value });
    }

    handleChangeContent(event){
        this.setState({ content: event.target.value });
    }


    AddPost(){
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>Название:</label><br/>
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChangeTitle} required/><br/>
                    <br/><label>Содержимое:</label><br/>
                    <textarea name="content" value={this.state.content} onChange={this.handleChangeContent} required/><br/><br/>



                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" name="filename"/>



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