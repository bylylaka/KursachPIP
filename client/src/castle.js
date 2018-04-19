import axios from "axios/index";
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
            hero_gold: '',
            castle_id: '',
            isAuthenticated: false,
        };

        this.subHeroMoney = this.subHeroMoney.bind(this);
    }

    componentDidMount() {
        const { castle } = this.props.match.params;

        axios.all([
            axios.get(`/castles/${castle}`),
            axios.get(`/sessionHero`),
            axios.get(`/sessionUser`)
        ])
            .then(axios.spread((castle, session_hero, session_user) => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");

                this.setState({ hero_gold : session_hero.data.gold });
                this.setState({ date: castle.data });
            }))
            .catch(error => console.log(error));
    }

    OnlyHero(hero){
        var Kartinka= './images/' + this.state.fractionName + '/' + hero.photo;
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
        );

        return listItems;
    }

    CastleHeroes(){
        return (
            <div className="formembers">
                <p>Лица замка</p>
                <p>{this.state.heroesCastle.length} штук:</p>
                <div className="members">
                    {this.ListHeroes()}
                </div>
            </div>
        )
    }

    subHeroMoney(){
        axios.all([
            axios.get(`/subHeroMoney/${this.state.castle_id}`)
        ])
            .catch(error => console.log(error));

        this.props.history.push("/enter/"+this.state.castle_id);
    }

    Castle () {
        var castles = Object.values(this.state.date).map((data) => {
            this.state.heroesCastle = data.heroesCastle;
            this.state.name = data.name;
            this.state.fraction = data.fraction;
            this.state.fractionName = data.fractionName;
            this.state.rating = data.rating;
            this.state.castle_id = data.id;

            if(this.state.hero_gold >= data.gold)
                return (<button onClick={this.subHeroMoney}>Вступить в {data.name}</button>);
            else
                return (<div>Недостаточно голды для вступления в замок))</div>)

        });

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
                <div className="chatCastle">
                </div>
                {this.CastleHeroes()}
                <div className="info">
                    <h2>Название: {this.state.name}</h2>
                    <h2>Расса: {this.state.fractionName}</h2>
                    <h2>Рейтинг: {this.state.rating}</h2>
                    {castles}
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
        else
            return(
                <div></div>
            );

    }
}