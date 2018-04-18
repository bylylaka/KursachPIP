import axios from "axios/index";
import './achivements.css';
var React = require('react');

export default class Achievements extends React.Component {

    constructor() {
        super();
        this.state = {
            achievements: '',
            isAuthenticated: false
        };
    }

    componentDidMount() {
        axios.all([
            axios.get(`/all_achievements`),
            axios.get(`/sessionUser`),
        ])
            .then(axios.spread((achievements, session_user) => {
                this.setState({achievements: achievements.data});
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");
            }))
            .catch(error => console.log(error));
    }

    Achievements(){
        let achievements = Object.values(this.state.achievements).map((achievement) => {
          return <div className="achivka">{achievement.achievement} - награда: {achievement.gold} голды</div>
        });
        return achievements;
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="achivements">
                    <h3>Достижения</h3>
                    {this.Achievements ()}
                </div>
            );
        }
        else
            return(
                <div></div>
            );
    }
}