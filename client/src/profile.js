import axios from "axios/index";
import './css/profile.css';
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class Profile extends React.Component {

    constructor() {
        super();
        this.state = {
            id: new Number(),
            name: new String(),
            gender: new String(),
            castle: new String(),
            castleName: new String(),
            fraction: new String(),
            experience: new String(),
            gold: new String(),
            isAuthenticated: false,
            photo: new String(),
            hero_achievements: '',
            all_achievements: '',
            Imga: new Object()
        };
    }

    componentDidMount() {
        const {profile} = this.props.match.params;

        axios.all([
            axios.get(`/profiles/${profile}`),
            axios.get(`/sessionUser`),
            axios.get(`/some_hero_achievements/${profile}`),
            axios.get(`/all_achievements`)
        ])
            .then(axios.spread((response, session_user, hero_achievements, all_achievements) => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/");

                this.setState({hero_achievements: hero_achievements.data });
                this.setState({all_achievements: all_achievements.data });
                this.setState({
                    id: response.data[0].id,
                    name: response.data[0].name,
                    gender: response.data[0].gender,
                    castle: response.data[0].castle,
                    castleName: response.data[0].castleName,
                    fraction: response.data[0].fraction,
                    experience: response.data[0].experience,
                    gold: response.data[0].gold,
                    photo: response.data[0].avapath
                });
                this.setState({selected: response.data[0].fraction });
            }))
            .catch(error => console.log(error));
    }

    Atrib(props) {
        if (props.name == "castle"){
        return (
            <div>
                <Link to={"../castles/"+props.value} style={{ display: 'inline', marginRight: '20px' }}>{props.name}: {props.value}</Link>
                <br/>
            </div>
        )}
        else {
            return (
                <div>
                    <p style={{display: 'inline', marginRight: '20px'}}>{props.name}: </p>
                    <p style={{display: 'inline'}}>{props.value}</p>
                    <br/>
                </div>
            )
        }
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
                <p>Profile</p>

                <img className="profilePicta" src={this.state.Imga} />
                <form onSubmit={this.handleSubmit}>
                    {this.Atrib({name :"name", value: this.state.name, readonly: 'true'})}
                    {this.Atrib({name :"gender", value: this.state.gender, readonly: 'true'})}
                    {this.Atrib({name :"castle", value: this.state.castleName, readonly: 'true'})}
                    {/*{this.Atrib({name :"experience", value: this.state.experience, readonly: 'true'})}*/}
                    {this.Atrib({name :"gold", value: this.state.gold, readonly: 'true'})}
                </form>
            </div>)
    }

    render() {
        return (
            <div className="Profile">
                {this.Prolife ()}
                <hr/>
                <h4>Достижения: </h4>
                {this.Achievements ()}
            </div>
        );
    }
}