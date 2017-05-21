import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

  state = {
    logs: [],
  }

  componentWillMount = async () => {
    const res = await axios.get('http://localhost:8000/log-data/fridge_0_zone_0');
    this.setState({logs: res.data})
  }

  render() {
    return (
      <div className="App">
        {JSON.stringify(this.state.logs)}
        This is an app. Foo.
      </div>
    );
  }
}

export default App;
