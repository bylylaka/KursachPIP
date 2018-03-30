import axios from "axios/index";
var React = require('react');

export default class AllCustles extends React.Component {

    constructor() {
        super();
        this.state = {date: new String()};
    }

    componentDidMount() {
        axios
            .get("/castle")
            .then(response => {
                this.setState({
                    date: response.data
                });
            })
            .catch(error => console.log(error));
    }

    AllCustles() {
        var castles = Object.values(this.state.date).map((data) => {
            return <p>Caslte id: {data.id} fraction:{data.fraction}</p>
        })
        return (<div>{castles}</div>);
    }

    render() {
        return (
            <div className="App">
                {this.AllCustles()}
            </div>
        );
    }
}