import axios from "axios/index";
import ChatCastle from "./chatCastle"
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
                if(!session_user.data) this.props.history.push("/login");
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

        return <img src={this.state.Imga} style={{width: '50px'}}/>
    }


    ListHeroes(){
        const listItems = this.state.heroesCastle.map((hero) =>
            <div>
                {this.OnlyHero(hero)}
                <Link to={"/profiles/"+hero.id}>{hero.name}</Link>
            </div>
        )

        return listItems;
    }

    CastleHeroes(){
        return (
            <div>
                <p>Castle members:</p>
                <div>
                    {this.ListHeroes()}
                </div>
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
                <img src={this.state.Imga} style={{width: '450px'}}/>
                <h2>Название: {this.state.name}</h2>
                <h2>Расса: {this.state.fractionName}</h2>
                <h2>Рейтинг: {this.state.rating}</h2>
                {castles}
                {this.CastleHeroes()}
            </div>
        )
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="App">
                    {this.Castle ()}
                    <div style={{position: 'absolute', right: '100px', top: '30px'}}>
                        <ChatCastle/>
                    </div>
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