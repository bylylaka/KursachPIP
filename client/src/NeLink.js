var React = require('react');
var Link = require ('react-router-dom').Link;

export default class NeLink extends React.Component {


    render() {
        return (
            <div>
                <h2>Этот аккаунт уже есть в базе, ебаный ты даун!</h2>
                <Link to="/">Пиздуй домой</Link>
            </div>
        )
    }
}
