import './css/index.css';
var React = require('react');
var Link = require ('react-router-dom').Link;

export default class NeLink extends React.Component {


    render() {
        return (
            <div className="userAccount">
                <Link to="/profile">
                    <h2>Этот аккаунт уже был использован при регистрации!</h2>
                    <h3>Попробуйте использвать другой!</h3>
                </Link>
            </div>
        )
    }
}
