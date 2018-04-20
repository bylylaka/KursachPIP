import './css/index.css';
import Castle from "./castle";
import AllCastles from "./forCastle";
import MyProfile from "./myProfile"
import MyCastle from "./myCastle"
import Profile from "./profile"
import Chat from "./Chat"
import ChatCastle from "./chatCastle"
import Menu from "./menu"
import Posts from "./posts";
import Post from "./post";
import Enter from "./enter";
import addPost from "./addPost";
import Achievements from "./achievements";


import loginFailure from "./loginFailure"
import signupFailure from "./signupFailure"

import NotFound from "./notFound";
import { Switch } from 'react-router-dom'

import twitter from '../src/icons/twitter.png';
import facebook from '../src/icons/facebook.png';

var React = require('react');
var ReactDOM = require('react-dom');
var BrowserRouter = require ('react-router-dom').BrowserRouter;
var Route = require ('react-router-dom').Route;
var Link = require ('react-router-dom').Link;


function Header() {
    return (<div>
        <header><Link to="/"><h1 className="heroesTitle">Герои меча и магии</h1></Link></header>
    </div>);
}

const BasicExample = () => (
    <div>
        <BrowserRouter>
            <div>
                <Menu/>
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/castle" component={AllCastles} />
                    <Route path="/castles/:castle" component={Castle} />
                    <Route path="/profile" component={MyProfile} />
                    <Route path="/enter/:castle_id" component={Enter} />
                    <Route path="/myCastle" component={MyCastle} />
                    <Route path="/profiles/:profile" component={Profile} />
                    <Route path="/addPost" component={addPost} />
                    <Route path="/posts" component={Posts} />
                    <Route path="/current-post/:post" component={Post} />
                    <Route path="/chat" component={Chat} />
                    <Route path="/chatCastle" component={ChatCastle} />
                    <Route path="/achievements" component={Achievements} />

                    <Route path="/loginFailure" component={loginFailure} />
                    <Route path="/signupFailure" component={signupFailure} />

                    <Route component={ NotFound } />
                </Switch>
            </div>
        </BrowserRouter>
    </div>
);



let sectionFacebook = {
    width: "75px",
    height: "75px",
    backgroundImage: `url(${facebook})`,
    backgroundSize: 'cover',
};

let sectionTwitter = {
    width: "75px",
    height: "75px",
    backgroundImage: `url(${twitter})`,
    backgroundSize: 'cover'
};

const Main = () => (
        <div className="text-center">
            <Header/>
            <h2>Скорее присоединяйся и в бой!</h2>

            <div className="localLogin">
                <Link to="/login">Войти</Link>
                <Link to="/signup">Зарегистрироваться</Link>
            </div>

            <div className="ouathLogin">
                <form action="/auth/facebook" method="POST">
                    <button title="Вход через Facebook" className="oauth" style={sectionFacebook} alt="Вход через Facebook"></button>
                </form>

                <form action="/auth/twitter" method="POST">
                    <button title="Вход через Twitter" className="oauth" style={sectionTwitter} alt="Вход через Twitter"></button>
                </form>
            </div>

        </div>
);

const Login = () => (
    <div className="text-center">
        <Header/>
        <form action="/login" method="post">
            <div>
                <br/>
                <input className="email" type="text" name="email" placeholder="Email"/>
            </div>
            <div>
                <br/>
                <input className="password" type="password" name="password" placeholder="Пароль"/>
            </div>

            <button className="passwordAndEmailButton" type="submit">Войти</button>
        </form>
    </div>
);


const About = () => (
    <div>
        <Header/>
        <h2>About</h2>
    </div>
);


const Signup = () => (
    <div className="text-center">
        <Header/>
        <form action="/signup" method="post">
            <div>
                <br/>
                <input className="email" type="text" name="email" placeholder="Email"/>
            </div>
            <div>
                <br/>
                <input className="password" type="password" name="password" placeholder="Пароль"/>
            </div>

            <button className="passwordAndEmailButton" type="submit">Зарегистрироваться</button>
        </form>
    </div>
);


ReactDOM.render(<BasicExample/>, document.getElementById('root'));