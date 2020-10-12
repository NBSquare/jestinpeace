import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './Auth';
import Counter from './Counter';
import './App.css';

export function Bar({ match }) {
  const foo = match.params.foo

  return <h1>{foo}</h1>
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Auth />
        </Route>
        <Route path="/counter">
          <Counter />
        </Route>
      </Switch>
    </Router>
  );
}
