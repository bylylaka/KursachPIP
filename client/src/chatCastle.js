import Websocket from 'react-websocket';
import axios from "axios/index";
import './css/posts.css';
import './css/Chat.css';
import { Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
var Scroll  = require('react-scroll');


var Link = require ('react-router-dom').Link;
var React = require('react');

export default class ChatCastle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: new Array(),
            mes: new String(),
            isAuthenticated: false,
            avatars: ''
        };

        this.getMessages = this.getMessages.bind(this);
    }

    componentDidMount() {
        axios.all([
            axios.get(`/sessionUser`),
            axios.get(`/getAvatars`)
        ])
            .then(axios.spread((session_user, avatars) => {
                this.setState({ avatars: avatars.data });
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/");
            }))
            .catch(error => console.log(error));


        // this is an "echo" websocket service for testing pusposes
        this.connection = new WebSocket('ws://localhost:8080/echoCastle');
        // listen to onmessage event
        this.connection.onmessage = evt => {
            // add the new message to state
            var newMessage = {
                hero: JSON.parse(evt.data).hero,
                hero_id: JSON.parse(evt.data).heroid,
                hero_ref: '/profiles/' + JSON.parse(evt.data).heroid,
                message: JSON.parse(evt.data).message,
                date: JSON.parse(evt.data).date_and_time
            }
            this.state.messages.push(newMessage);
            this.setState({messages:this.state.messages});
        };
    }

    scrollToTop() {
        scroll.scrollToTop();
    }

    scrollToBottom() {
        scroll.scrollToBottom();
    }


    handleData(data) {
        this.state.messages.push(data)
        this.setState({ mes: data});
    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.state.mes != '')
            this.connection.send(this.state.mes);
        this.setState({ mes: '' });
    }

    onChange = e => {
        this.setState({ mes: e.target.value });
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

    getMessages(){
        let messages = Object.values(this.state.messages).map((msg) => {
            return (
                <React.Fragment>
                    <div>
                        <Link to={ msg.hero_ref } className="hero">
                            <div className="avatar">{this.heroAvatar(msg.hero_id)}</div>
                            <div className="userAndDateCastle">
                                <div className="user">{ msg.hero }</div>
                                <div className="date">{ msg.date }</div>
                            </div>
                        </Link>
                        <div className="message">{ msg.message }</div>
                        <hr/>
                    </div>
                </React.Fragment>
            );
        });

        return messages;
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="chat">
                    <p id="blink" onClick={this.scrollToBottom} title="Scroll вниз"><i id="scrollDownCastle"></i></p>
                    {this.getMessages()}
                    <form name="publish" onSubmit={this.handleSubmit}>
                        <div className="messageSendBlockCastle">
                            <input type="text" name="message" value={this.state.mes} onChange={this.onChange} placeholder="Написать сообщение..."/>
                            <button className="sendMessageButton" type="submit">Отправить</button>
                        </div>
                    </form>
                    <p id="blink" onClick={this.scrollToTop} title="Scroll вверх"><i id="scrollUpCastle"></i></p>
                </div>
            );
        }
        else
            return(
                <div></div>
            );
    }
}