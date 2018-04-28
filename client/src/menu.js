import './css/menu.css';
import axios from "axios/index";
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isOpened: false
        };
        this.toggleState = this.toggleState.bind(this);
    }

    componentDidMount() {
        axios
            .get(`/sessionUser`)
            .then(session_user => {
                this.setState({isAuthenticated: session_user.data});
                if (!session_user.data) this.props.history.push("/");
            })
            .catch(error => console.log(error));
    }

    logOut() {
        axios
            .get(`/logout`)
            .catch(error => console.log(error));
        window.location.reload();
    }

    toggleState() {
        this.setState({isOpened: !this.state.isOpened});
    }


    render() {
        if (this.state.isAuthenticated) {
        }
        else
            return <div></div>

        let dropDownMenu;
        let classForblockMenu = '';
        let display = (<div onClick={this.toggleState} className="openMenu">Меню</div>);
        let crestik = '';
        document.body.classList.remove('forHTML');

        let classNameForCheck = 'top-menu checker';
        if (this.state.isOpened) {
            display = '';
            crestik = (<p className="crestik" onClick={this.toggleState}>X</p>);
            classForblockMenu = 'blockMenu';
            document.body.classList.add('forHTML');

            classNameForCheck = 'top-menu';
        }

        dropDownMenu = (
            <nav className={classNameForCheck}>
                {crestik}
                <ul className="menu-main">
                    <Link onClick={this.toggleState} to="/profile">Профиль</Link>
                    <Link onClick={this.toggleState} to="/myCastle">Замок</Link>
                    <Link onClick={this.toggleState} to="/chat">Переговорная</Link>
                    <Link onClick={this.toggleState} to="/posts">Мемасы</Link>
                    <Link onClick={this.toggleState} to="/castle">Ночлежки</Link>
                    <Link onClick={this.toggleState} to="/achievements">Заслуги</Link>
                    <Link to="/" onClick={this.logOut}>Выйти</Link>
                </ul>
            </nav>
        );

            return (
                <div className={classForblockMenu}>
                    {/*<div onClick={this.toggleState} className="openMenu">Меню</div>*/}
                    {display}
                    {dropDownMenu}
                </div>
            );
        }
    }