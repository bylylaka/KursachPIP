import axios from "axios/index";
import './profile.css';
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
            experience: new String(),
            gold: new String()
        };
    }

    componentDidMount() {
        const { profile } = this.props.match.params
        axios
            .get(`/profiles/${profile}`)
            .then(response => {
                this.setState({
                    id: response.data[0].id,
                    name: response.data[0].name,
                    gender: response.data[0].gender,
                    castle: response.data[0].castle,
                    experience: response.data[0].experience,
                    gold: response.data[0].gold
                });
            })
            .catch(error => console.log(error));
    }

    Atrib(props) {
        return (
            <div>
                <p style={{ display: 'inline', marginRight: '20px' }}>{props.name}: </p>
                <p style={{ display: 'inline' }}>{props.value}</p>
                <br/>
            </div>
    )}

    Prolife () {
        return (
            <div>
                <p>Your profile</p>
                <form onSubmit={this.handleSubmit}>
                    {this.Atrib({name :"name", value: this.state.name, readonly: 'true'})}
                    {this.Atrib({name :"gender", value: this.state.gender, readonly: 'true'})}
                    {this.Atrib({name :"castle", value: this.state.castle, readonly: 'true'})}
                    {this.Atrib({name :"experience", value: this.state.experience, readonly: 'true'})}
                    {this.Atrib({name :"gold", value: this.state.gold, readonly: 'true'})}
                </form>
            </div>)
    }

    render() {
        return (
            <div className="Profile">
                {this.Prolife ()}
            </div>
        );
    }
}