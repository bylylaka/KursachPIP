import axios from "axios/index";
import ChatCastle from "./chatCastle"
import './css/myCastle.css';
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class Castle extends React.Component {

    constructor() {
        super();
        this.state = {
            date: new String(),
            name: new String(),
            fraction: new String(),
            fractionName: new String(),
            rating: new String(),
            heroesCastle: new Array(),
            Imga: new Object(),
            isAuthenticated: false
        };
    }

    componentDidMount() {
        const { castle } = this.props.match.params

        axios.all([
            axios.get(`/myCastle`),
            axios.get(`/sessionUser`),
        ])
            .then(axios.spread((castle, session_user) => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/");
                this.setState({date: castle.data });
            }))
            .catch(error => console.log(error));
    }

    OnlyHero(hero){
        var Kartinka= './images/' + this.state.fractionName + '/' + hero.photo;
        console.log(Kartinka)
        try {
            this.state.Imga = require(``+Kartinka);
        } catch (e) {
            try {
                Kartinka= './images/emptyAvatar.jpg';
                this.state.Imga = require(``+Kartinka);
            } catch (e) {
                console.log('Нет фоточки((9((9(')
            }
        }

        return <img src={this.state.Imga}/>
    }


    ListHeroes(){
        const listItems = this.state.heroesCastle.map((hero) =>
            <div className="heroProfile">
                <Link to={"/profiles/"+hero.id}>
                    {this.OnlyHero(hero)}
                    <br/>
                    <div className="heroProfileName">{hero.name}</div>
                    <hr/>
                </Link>
            </div>
        )

        return listItems;
    }

    CastleHeroes(){
        let members;
        if(this.state.heroesCastle.length >= 5 && this.state.heroesCastle.length <= 20) members = ' союзников';
        else{
            let subCounter = this.state.heroesCastle.length % 10;
            if (subCounter == 1) {
                members = ' союзник';
            } else if (subCounter >= 2 && subCounter <= 4) {
                members = ' союзника';
            } else {
                members = ' союзников';
            }

        }

        return (
            <div className="formembers">
                <p>{this.state.heroesCastle.length}{members}</p>
                <hr/>
                <div className="members">
                    {this.ListHeroes()}
                </div>
                <hr/>
            </div>
        )
    }
    Castle () {
        var castles = Object.values(this.state.date).map((data) => {
            this.state.heroesCastle = data.heroesCastle;
            this.state.name = data.name;
            this.state.fraction = data.fraction;
            this.state.fractionName = data.fractionName;
            this.state.rating = data.rating;
        })

        var Kartinka= './images/'+ this.state.fractionName + '/castle.jpg';
        try {
            this.state.Imga = require(``+Kartinka);
        } catch (e) {
            try {
                Kartinka= './images/emptyAvatar.jpg';
                this.state.Imga = require(``+Kartinka);
            } catch (e) {
                console.log('Нет фоточки((9((9(')
            }
        }

        return (
            <div>
                <div className="divCastlePicta">
                    <img className="castlePicta" src={this.state.Imga}/>
                </div>
                <div className="castleContent">

                    <div className="info">
                        <h1>{this.state.name}</h1>
                        <h2>Расса: {this.state.fractionName}</h2>
                        <h2>Рейтинг: {this.state.rating}</h2>
                        {castles}
                    </div>

                    {this.CastleHeroes()}

                    <div className="chatCastle">
                        <ChatCastle/>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="myCastle">
                    {this.Castle ()}
                </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }
}