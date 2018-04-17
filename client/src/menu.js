import './menu.css';
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class Menu extends React.Component {

    render() {
        return (
            <nav className="top-menu">
                <ul className="menu-main">
                    <Link to="/profile">Профиль</Link>
                    <Link to="/myCastle">Замок</Link>
                    <Link to="/chat">Переговорная</Link>
                    <Link to="/posts">Мемасы</Link>
                    <Link to="/castle">Ночлежки</Link>
                    <Link to="/achievements">Заслуги</Link>
                    <form action="/logout" method="POST">
                        <button>Log out</button>
                    </form>
                </ul>
            </nav>
        );
    }
}