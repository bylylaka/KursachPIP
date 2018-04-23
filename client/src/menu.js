import './css/menu.css';
import axios from "axios/index";
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        };
    }

    componentDidMount() {
        axios
            .get(`/sessionUser`)
            .then(session_user => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/");
            })
            .catch(error => console.log(error));
    }

    logOut(){
        axios
            .get(`/logout`)
            .catch(error => console.log(error));
        window.location.reload();
    }

    render() {
        if(this.state.isAuthenticated) {
        }
        else
            return <div></div>
        return (
            <nav className="top-menu">
                <ul className="menu-main">
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