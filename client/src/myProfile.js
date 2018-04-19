import axios from "axios/index";
import './css/profile.css';
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
            hero_gold: ''
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
            axios.get(`/sessionUser`)
        ])
            .then(axios.spread((response, session_hero, hero_achievements, all_achievements, session_user) => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");

                this.setState({ hero_gold : session_hero.data.gold });
                this.setState({hero_achievements: hero_achievements.data });
                this.setState({all_achievements: all_achievements.data });
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


                    {this.Atrib({name :"name", value: this.state.name, readonly: 'true'})}

                    <div className="Attribute">
                        <p>gender:</p>
                        <select name="gender" onChange={this.handleChange}>
                            {this.Option({gender: 'man'})}
                            {this.Option({gender: 'woman'})}
                        </select>
                    </div>

                    {this.Atrib({name :"castleName", value: this.state.castleName, readonly: 'true'})}
                    {/*{this.Atrib({name :"experience", value: this.state.experience, readonly: 'true'})}*/}
                    {this.Atrib({name :"gold", value: this.state.gold, readonly: 'true'})}
                    <button>Отправить!</button>
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
                <br/><button type="submit" disabled={this.state.selected === this.state.fraction || this.state.hero_gold < 500}>Присоединиться!</button>
                <div className={noMoneyMsgClass}>Недостаточно голды для смены фракции!</div>
            </form>
        );
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="Profile">
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