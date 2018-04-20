import axios from "axios/index";
import './css/addPost.css';
import './css/posts.css';
var React = require('react');

export default class Post extends React.Component {

    constructor() {
        super();
        this.state = {
            hero: '',
            title: '',
            content: '',
            isAuthenticated: false,
            fileLoaded: ''
        };

        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeContent = this.handleChangeContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    componentDidMount() {
        axios.all([
            axios.get('/myHero'),
            axios.get(`/sessionUser`)
        ])
            .then(axios.spread((hero, session_user) => {
                this.setState({ hero: hero.data });
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/");
            }))
            .catch(error => console.log(error));
    }

    handleSubmit(e){

        e.preventDefault();

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

    uploadFile(event) {
        let file = event.target.files[0];
        //alert(file.name);
        let qq = '' + file.name;
        this.setState({ fileLoaded: qq + ' успешно загружен' });
    }

    AddPost(){
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <br/>
                    <input className="newPostTitle" type="text" name="title" value={this.state.title} onChange={this.handleChangeTitle} placeholder="Тема..." required/><br/>
                    <br/>
                    <textarea className="newPostContent" name="content" value={this.state.content} onChange={this.handleChangeContent} placeholder="Здесь вы можете унизить чуждые вам рассы и доказать свое превосходство!" required/><br/><br/>

                    <label for="upload" className="newPostFile">Загрузить файл</label>
                    <input id="upload" className="newPostFileHover" onChange={this.uploadFile} ref={(ref) => { this.uploadInput = ref; }} type="file" name="filename"/>


                </div>
                <br/><button type="submit" className="newPostButton">Запилить</button>
            </form>
        );
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="post">
                    {this.AddPost ()}
                    {this.state.fileLoaded}
                </div>
            );
        }
        else
            return(
              <div></div>
            );

    }
}