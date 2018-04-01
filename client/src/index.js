//import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter, Route, Link } from 'react-router-dom';
// import axios from "axios";
import './index.css';
import AllCustles from './forCustle'
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
                <Route exact path="/" component={Main} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Login} />
                <Route path="/auth/facebook" component={Login} />
                <Route path="/auth/twitter" component={Login} />
                <Route path="/castle" component={AllCustles} />
                <Route path="/profile" component={Profile} />
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
            <Link to="/auth/facebook"> Facebook</Link>
            <Link to="/auth/twitter"> Twitter</Link>
            <hr />
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


const About = () => (
    <div>
        <Header/>
        <h2>About</h2>
    </div>
);


function REstApi() {
    fetch('/castle')
        .then((res) => {
            res.json().then((data) => {
                console.log(data.Error);  //Вывод в консоль
            })
        })
        .catch((err) => {
            console.log(err)
        })
    return (<p>Hello</p>);
}



const Profile = () => (
    <div>
        <Header/>
        <h2>Hello!</h2>
    </div>
);




ReactDOM.render(<BasicExample/>, document.getElementById('root'))