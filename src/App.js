import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Auth from './containers/Auth/Auth';
// import Playlists from './containers/Playlists/Playlists';
// import Songs from './containers/Songs/Songs';
import Layout from './containers/Layout/Layout';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncPlaylists = asyncComponent(() => {
  return import('./containers/Playlists/Playlists');
})

const asyncSongs = asyncComponent(() => {
  return import('./containers/Songs/Songs');
})

class App extends Component {
  componentDidMount() {
    this.props.onAuthCheckStateHandler();
  }

  render() {
    let route;
    if (this.props.isAuthenticated) {
      route = (
        <Switch>
          <Route path='/playlists/:id' component={asyncSongs}></Route>
          <Route path='/playlists' component={asyncPlaylists}></Route>
          <Route path='/logout' component={Logout}></Route>
          <Redirect to='/playlists'/>
        </Switch>
      );
    } else {
      route = (
        <Switch>
          <Route path='/auth' exact component={Auth}></Route>
          <Redirect to='/auth'/>
        </Switch>
      );
    }

    return (
      <div className="App">
        <BrowserRouter>
          <Layout>
            {route}
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.tokenId != null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheckStateHandler: () => dispatch(actions.authCheckState()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
