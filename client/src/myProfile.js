import axios from "axios/index";
import './profile.css';
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
            experience: new String(),
            gold: new String(),
            fraction: new String(),
            photo: new String(),
            avaS: new Array(),
            Imga: new Object()
        };

        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        const { Profile } = this.props.match.params;
        axios
            .get(`/myHero`)
            .then(response => {
                this.setState({
                    id: response.data[0].id,
                    name: response.data[0].name,
                    gender: response.data[0].gender,
                    castle: response.data[0].castle,
                    experience: response.data[0].experience,
                    gold: response.data[0].gold,
                    fraction: response.data[0].fraction,
                    photo: response.data[0].avapath,
                    avaS: response.data[0].avaS,
                });
                console.log(this.state.avaS)
            })
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

                <img src={this.state.Imga} />
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

                    {this.Atrib({name :"castle", value: this.state.castle, readonly: 'true'})}
                    {this.Atrib({name :"experience", value: this.state.experience, readonly: 'true'})}
                    {this.Atrib({name :"gold", value: this.state.gold, readonly: 'true'})}
                    <button>Send data!</button>
                </form>
            </div>)
    }

    logOut(){
        axios
            .get(`/logout`)
            .catch(error => console.log(error));
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="Profile">
                {this.Prolife ()}
                <hr/>
                <button onClick={this.logOut}>Выйти</button>
            </div>
        );
    }
}


const options = {
    position: 'bottom center',
    timeout: 5000,
    offset: '30px',
    transition: 'scale'
};