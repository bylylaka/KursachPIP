import axios from "axios/index";
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
            hero_gold: ''
        };
    }

    componentDidMount() {
        const { castle } = this.props.match.params;

        axios.all([
            axios.get(`/castles/${castle}`),
            axios.get(`/sessionHero`),
        ])
            .then(axios.spread((castle, session_hero) => {
                this.setState({ hero_gold : session_hero.data.gold });
                this.setState({ date: castle.data });
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
            if(this.state.hero_gold >= data.gold)
                return (<Link to={"/enter/"+data.id}>Вступить в {data.name}!</Link>);
            else
                return (<div>Недостаточно голды для вступления в замок))</div>)

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
                {this.CastleHeroes()}
                <h2>Название: {this.state.name}</h2>
                <h2>Расса: {this.state.fractionName}</h2>
                <h2>Рейтинг: {this.state.rating}</h2>
                {castles}
            </div>
        )
    }

    render() {
        return (
            <div className="App">
                {this.Castle ()}
            </div>
        );
    }
}