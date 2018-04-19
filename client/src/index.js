//import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter, Route, Link } from 'react-router-dom';
// import axios from "axios";
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


import NotFound from "./notFound";
import { Switch } from 'react-router-dom'

var React = require('react');
var ReactDOM = require('react-dom');
var BrowserRouter = require ('react-router-dom').BrowserRouter;
var Route = require ('react-router-dom').Route;
var Link = require ('react-router-dom').Link;


function Header() {
    return (<div>
        <header><h1>Герои меча и магии</h1></header>
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
                    <Route component={ NotFound } />
                </Switch>
            </div>
        </BrowserRouter>
    </div>
);


const Main = () => (
        <div className="text-center">
            <Header/>
            <p>Login or Register with:</p>
            <Link to="/login"> Local Login</Link>
            <Link to="/signup"> Local Signup</Link>

            <form action="/auth/facebook" method="POST">
                <button>Auth with Facebook!</button>
            </form>

            <form action="/auth/twitter" method="POST">
                <button>Auth with Twitter!</button>
            </form>
        </div>
);

const Login = () => (
    <div className="text-center">
        <Header/>
        <form action="/login" method="post">
            <div>
                <label>Email</label>
                <input type="text" name="email"/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password"/>
            </div>

            <button type="submit">Login</button>
        </form>
    </div>
);


const Signup = () => (
    <div className="text-center">
        <Header/>
        <form action="/signup" method="post">
            <div>
                <label>Email</label><br/>
                <input type="text" name="email"/>
            </div>
            <div>
                <label>Придумайте Password</label><br/>
                <input type="password" name="password"/>
            </div>

            <button type="submit">Signup</button>
        </form>
    </div>
);


const About = () => (
    <div>
        <Header/>
        <h2>About</h2>
    </div>
);


ReactDOM.render(<BasicExample/>, document.getElementById('root'))