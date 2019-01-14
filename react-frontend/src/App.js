import React, { Component } from 'react';
import './App.css';
import TodoContainer from './components/TodoContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>What's on the docket?</h1>
        <TodoContainer />
      </div>
    );
  }
}

export default App;
