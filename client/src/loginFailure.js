import './css/index.css';
var Link = require ('react-router-dom').Link;
var React = require('react');

export default class LoginFailure extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {

    }

    Header() {
        return (<div>
            <header><Link to="/"><h1>Герои меча и магии</h1></Link></header>
        </div>);
    }

    render() {
        return(
            <div className="text-center">
                {this.Header()}
                <div className="errorMessage">Некорректный логин и пароль!</div>
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
    }
}