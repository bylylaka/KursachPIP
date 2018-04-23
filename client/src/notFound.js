let React = require('react');

export default class notFound extends React.Component {

    constructor() {
        super();
        this.state = {};

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="notFound">
                <h1>404</h1>
                <h2>Sorry, man, but such page NOT FOUND!!!</h2>
            </div>
        );
    }
}