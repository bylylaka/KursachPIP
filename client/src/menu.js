import './css/menu.css';
import axios from "axios/index";
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class Menu extends React.Component {

    logOut(){
        axios
            .get(`/logout`)
            .catch(error => console.log(error));
        this.props.history.push("/");
    }

    render() {
        return (
            <nav className="top-menu">
                <ul className="menu-main">
                    <Link to="/">Главная</Link>
                    <Link to="/profile">Профиль</Link>
                    <Link to="/myCastle">Замок</Link>
                    <Link to="/chat">Переговорная</Link>
                    <Link to="/posts">Мемасы</Link>
                    <Link to="/castle">Ночлежки</Link>
                    <Link to="/achievements">Заслуги</Link>
                    <Link to="/" onClick={this.logOut}>Выйти</Link>
                </ul>
            </nav>
        );
    }
}