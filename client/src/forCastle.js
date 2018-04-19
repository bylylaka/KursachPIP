import axios from "axios/index";
import './css/forCastle.css';
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class AllCastles extends React.Component {

    constructor() {
        super();
        this.state = {
            date: new String(),
            isAuthenticated: false
        };
    }

    componentDidMount() {
        axios.all([
            axios.get(`/castle`),
            axios.get(`/sessionUser`),
        ])
            .then(axios.spread((castle, session_user) => {
                this.setState({isAuthenticated : session_user.data });
                if(!session_user.data) this.props.history.push("/login");
                this.setState({date: castle.data});
            }))
            .catch(error => console.log(error));
    }

    AllCastles() {
        var castles = Object.values(this.state.date).map((data) => {
            return <Link to={"castles/"+data.name} className="castle">Castle {data.name}</Link>
        })
        return (<div>{castles}</div>);
    }

    render() {
        if(this.state.isAuthenticated){
            return (
                <div className="castles">
                    {this.AllCastles()}
                </div>
            );
        }
        else
            return(
                <div></div>
            );
    }
}