import axios from "axios/index";
import './css/profile.css';
import addLocal from "./addLocal";
import twitter from '../src/icons/twitter.png';
import facebook from '../src/icons/facebook.png';
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class MyCabinet extends React.Component {

    constructor() {
        super();
        this.state = {
            id: new Number(),
            name: new String(),
            gender: new String(),
            castle: new String(),
            castleName: new String(),
            experience: new String(),
            gold: new String(),
            fraction: new String(),
            photo: new String(),
            avaS: new Array(),
            Imga: new Object(),
            isAuthenticated: false,
            hero_achievements: '',
            all_achievements: '',
            selected: '',
            hero_gold: '',
            local_id: '',
            facebook_id: '',
            twitter_id: '',
            allAccounts: '',
        };

        this.logOut = this.logOut.bind(this);
        this.subHeroMoney = this.subHeroMoney.bind(this);
        this.getFractionName = this.getFractionName.bind(this);
        this.handleOnChangeFraction = this.handleOnChangeFraction.bind(this);
        this.handleSubmitFraction = this.handleSubmitFraction.bind(this);
    }

    componentDidMount() {
        const { Profile } = this.props.match.params;

        axios.all([
            axios.get(`/myHero`),
            axios.get(`/sessionHero`),
            axios.get(`/hero_achievements`),
            axios.get(`/all_achievements`),
            axios.get(`/sessionUser`),
            axios.get(`/accountAuthInfo`)
        ])
            .then(axios.spread((response, session_hero, hero_achievements, all_achievements, session_user, accountAuthInfo) => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/");
                this.setState({ hero_gold : session_hero.data.gold });
                this.setState({hero_achievements: hero_achievements.data });
                this.setState({all_achievements: all_achievements.data });
                this.setState({local_id: accountAuthInfo.data.local_id, facebook_id: accountAuthInfo.data.facebook_id,
                    twitter_id: accountAuthInfo.data.twitter_id});

                if (this.state.local_id != null && this.state.facebook_id != null && this.state.twitter_id != null)
                    this.setState({allAccounts: 'Da' });
                else
                    this.setState({allAccounts: null })

                this.setState({
                    id: response.data[0].id,
                    name: response.data[0].name,
                    gender: response.data[0].gender,
                    castle: response.data[0].castle,
                    castleName: response.data[0].castleName,
                    experience: response.data[0].experience,
                    gold: response.data[0].gold,
                    fraction: response.data[0].fraction,
                    photo: response.data[0].avapath,
                    avaS: response.data[0].avaS,
                });
                this.setState({selected: response.data[0].fraction });
            }))
            .catch(error => console.log(error));
    }



    handleChange = event => {
        this.setState({ gender: event.target.value });
    }

    handleChangePhoto = event => {
        this.setState({ photo: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        axios.post(`/changeProlile`, this.state)
            .then(res => {
                alert('Данные изменены!');
            })
    }

    Atrib(props) {
        return (props.readonly)
            ? <div className="Attribute">
                <p>{props.name}: </p>
                <input type="text" value={props.value} readOnly="true" onChange={this.handleChange}></input>
            </div>
            : <div className="Attribute">
                <p>{props.name}: </p>
                <input type="text" value={props.value} onChange={this.handleChange}></input>
            </div>
    }

    Option(props) {
        return (this.state.gender ===  props.gender)
            ? <option selected name = "gender" value={props.gender}>{props.gender}</option>
            : <option name = "gender" value={props.gender}>{props.gender}</option>
    }




    AuthWayLocal(props) {
        return (props.znach !=  null)
            ? <div/>
            :  <Link to={"/addLocal"}>Локальную</Link>
    }

    AuthWayFacebook(props) {
        return (props.znach !=  null)
            ? <div/>
            : <form action="/connect/facebook" method="POST">
                <button className="oauth" style={sectionFacebook} alt="Вход через Facebook" title="Вход через Facebook"></button>
            </form>
    }

    AuthWayTwitter(props) {
        return (props.znach !=  null)
            ? <div/>
            : <form action="/connect/twitter" method="POST">
                <button className="oauth" style={sectionTwitter} alt="Вход через Twitter" title="Вход через Twitter"></button>
            </form>
    }



    AddAccounts() {
        if (this.state.local_id == null || this.state.facebook_id == null || this.state.twitter_id == null)
            return (
                <div className="AddAccounts">
                    <p style={{color: "rgba(100,100,255,0.6)"}}>Присоеденить учетную запись:</p>
                    {this.AuthWayLocal({way: 'local', znach: this.state.local_id})}
                    {this.AuthWayFacebook({way: 'facebook', znach: this.state.facebook_id})}
                    {this.AuthWayTwitter({way: 'twitter', znach: this.state.twitter_id})}
                </div>
            )
    }




    Prolife () {
        var Kartinka= './images/' + this.state.fraction + '/' + this.state.photo;

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
                <p>Your profile</p>
                <img src={this.state.Imga} className="profilePicta"/>
                <br/>
                <form onSubmit={this.handleSubmit}>

                    <select name="photo" onChange={this.handleChangePhoto}>
                        {
                            this.state.avaS.map( (ava) =>
                            (ava.pathname ===  this.state.photo)
                                ? <option value={ava.pathname} selected>{ava.name}</option>
                                : <option value={ava.pathname}>{ava.name}</option>)
                        }
                    </select>


                    <div>Name: {this.state.name}</div>

                    <div className="Attribute">
                        <p>Gender:</p>
                        <div>
                            <select name="gender" onChange={this.handleChange}>
                                {this.Option({gender: 'man'})}
                                {this.Option({gender: 'woman'})}
                            </select>
                        </div>
                    </div>

                    <div>Castle: {this.state.castleName}</div>
                    <div>Gold: {this.state.gold}</div>
                    <button className="joinButton">Отправить!</button>
                </form>
            </div>
        )
    }

    Achievements(){
        let achievements = Object.values(this.state.all_achievements).map((achievement) => {
            let hero_achievemens = Object.values(this.state.hero_achievements).map((hero) => {
                if(achievement.id === hero.achievement_id){
                    return <div>{achievement.achievement} Голды получено: {achievement.gold}</div>
                }
            });
            return hero_achievemens;
        });
        return achievements;
    }

    logOut(){
        axios
            .get(`/logout`)
            .catch(error => console.log(error));
        this.props.history.push("/");
    }



    handleSubmitFraction(e){
        e.preventDefault();


        switch (this.state.selected) {
            case 'alians':
                alert("Теперь вы состоите в Альянсе!");
                break;
            case 'gnomes':
                alert("Количество гномов: +1)");
                break;
            case 'orda':
                alert("Ты и так был орком))");
                break;
            case 'devils':
                alert("Добро пожаловать в Царство Сатаны!");
                break;
            default:
                alert( 'NO SUCH FRACTION!' );
        }


        const data = new FormData();
        data.append('fraction', this.state.selected);

        axios
            .post(`/submitfraction`, data)
            .then(response => {
                console.log("done");
            })
            .catch(error => console.log(error));

        window.location.reload();
    }

    getFractionName(){
        switch (this.state.fraction) {
            case 'alians':
                return 'Альянс';
                break;
            case 'gnomes':
                return 'Гном';
                break;
            case 'orda':
                return 'ОРК)';
                break;
            case 'devils':
                return 'Дьявол';
                break;
        }
    }

    handleOnChangeFraction(e){
        this.setState({ selected: e.target.value });
    }

    subHeroMoney(){
        axios.all([
            axios.get(`/subHeroMoney/${this.state.castle_id}`)
        ])
            .catch(error => console.log(error));

        this.props.history.push("/enter/"+this.state.castle_id);
    }

    addFraction(){
        let noMoneyMsgClass = 'yeapMoney';
        if(this.state.hero_gold < 500)
            noMoneyMsgClass = 'noMoney';
        return (
            <form onSubmit={this.handleSubmitFraction}>
                <div>
                    <p>Текущая фракция: {this.getFractionName()}</p>
                    <label>Орда</label>
                    <input type='radio' id='orda' name='race' value='orda' checked={this.state.selected == 'orda'}  onChange={this.handleOnChangeFraction} />
                    <br />
                    <label>Альянс</label>
                    <input type='radio' id='alians' name='race' value='alians' checked={this.state.selected == 'alians'} onChange={this.handleOnChangeFraction} />
                    <br />
                    <label>Гномы</label>
                    <input type='radio' id='gnomes' name='race' value='gnomes' checked={this.state.selected == 'gnomes'} onChange={this.handleOnChangeFraction} />
                    <br />
                    <label>Дьяволы</label>
                    <input type='radio' id='devils' name='race' value='devils' checked={this.state.selected == 'devils'} onChange={this.handleOnChangeFraction} />
                </div>
                <hr/>
                <div>Смена фракции: 500 голды</div>
                <br/><button className="joinButton" type="submit" disabled={this.state.selected === this.state.fraction || this.state.hero_gold < 500}>Присоединиться!</button>
                <div className={noMoneyMsgClass}>Недостаточно голды для смены фракции!</div>
            </form>
        );
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="Profile">
                    {this.AddAccounts()}
                    {this.addFraction ()}
                    {this.Prolife ()}
                    <hr/>
                    <h4>Достижения: </h4>
                    {this.Achievements ()}
                    <Link to={"/achievements"}><h6>Посмотреть все достижения</h6></Link>
                    <hr/>
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


const options = {
    position: 'bottom center',
    timeout: 5000,
    offset: '30px',
    transition: 'scale'
};


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