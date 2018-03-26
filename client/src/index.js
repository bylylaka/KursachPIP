import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Forma() {
    return (<div className="text-center">
        <p>Login or Register with:</p>
        <a href="/login" className="btn btn-default"><span className="fa fa-user"></span> Local Login</a>
        <a href="/signup" className="btn btn-default"><span className="fa fa-user"></span> Local Signup</a>
        <a href="/auth/facebook" className="btn btn-primary"><span className="fa fa-facebook"></span> Facebook</a>
        <a href="/auth/twitter" className="btn btn-info"><span className="fa fa-twitter"></span> Twitter</a>
    </div>)
}


function Header() {
    return (<div>
        <header><h1>Герои меча и магии</h1></header>
    </div>);
}


ReactDOM.render(<div><Header/><Forma/></div>, document.getElementById('root'))