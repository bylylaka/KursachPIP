import "./css/main.css"
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class addLocal extends React.Component {

    Header() {
        return (<div>
            <header><Link to="/"><h1 className="heroesTitle">Герои меча и магии</h1></Link></header>
        </div>);
    }


    render() {
        return (
            <div className="text-center">
                {this.Header}
                <form action="/connect/local" method="post">
                    <p>Присоеденить локалку</p>
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
    }
}