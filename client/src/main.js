import axios from "axios/index";
import twitter from '../src/icons/twitter.png';
import facebook from '../src/icons/facebook.png';
import "./css/main.css"
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class Main extends React.Component {

    constructor() {
        super();
        this.state = {
            date: new String(),
            isAuthenticated: false
        };
    }

    componentDidMount() {
        axios.all([
            axios.get(`/sessionUser`)
        ])
            .then(axios.spread((session_user) => {
                this.setState({isAuthenticated : session_user.data });
                if(session_user.data) this.props.history.push("/profile");
            }))
            .catch(error => console.log(error));
    }


    Header() {
        return (<div>
            <header><Link to="/"><h1 className="heroesTitle">Герои меча и магии</h1></Link></header>
        </div>);
    }




    render() {
        if(!this.state.isAuthenticated){
            return (
                <div className="text-center main">
                    {this.Header()}
                    <h2>Скорее присоединяйся и в бой!</h2>

                    <div className="localLogin">
                        <Link to="/login">Войти</Link>
                        <Link to="/signup">Зарегистрироваться</Link>
                    </div>

                    <div className="ouathLogin">
                        <form action="/auth/facebook" method="POST">
                            <button className="oauth" style={sectionFacebook} alt="Вход через Facebook" title="Вход через Facebook"></button>
                        </form>

                        <form action="/auth/twitter" method="POST">
                            <button className="oauth" style={sectionTwitter} alt="Вход через Twitter" title="Вход через Twitter"></button>
                        </form>
                    </div>

                </div>
            );
        }
        else
            return(
                <div></div>
            );
    }
}

var sectionFacebook = {
    width: "75px",
    height: "75px",
    backgroundImage: `url(${facebook})`,
    backgroundSize: 'cover',
};

var sectionTwitter = {
    width: "75px",
    height: "75px",
    backgroundImage: `url(${twitter})`,
    backgroundSize: 'cover',
};