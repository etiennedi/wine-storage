import React, { Component } from 'react';
import axios from 'axios';

import { Line } from 'react-chartjs-2';

import './App.css';

const initialDataset = {
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'rgba(75,192,192,0.4)',
  borderColor: 'rgba(75,192,192,1)',
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: 'rgba(75,192,192,1)',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
}


const  options= {
    scales: {
      yAxes: [{
        position: "left",
        "id": "temperature"
      }, {
        position: "right",
        "id": "humidity"
      }]
    }}

class App extends Component {

  state = {
    logs: [],
  }

  componentWillMount = async () => {
    const res = await axios.get('http://localhost:8000/log-data/fridge_0_zone_0');
    this.setState({logs: res.data})
  }

  render() {

    const temp = this.state.logs.map( item => item.temperature);
    const humidity = this.state.logs.map( item => item.humidity);
    const labels = this.state.logs.map( item => item.datetime);
    const data = {
      labels: labels,
      datasets: [
        {
          ...initialDataset,
          data: temp,
          label: 'Temperature',
          yAxisID: 'temperature'
        },
        {
          ...initialDataset,
          data: humidity,
          label: 'Humidity',
          yAxisID: 'humidity',
          pointBorderColor: 'rgba(192,75,192,1)',
          borderColor: 'rgba(192,75,192,1)',
          backgroundColor: 'rgba(192,75,192,0.4)',
       }
      ]
    }

    return (
      <div className="App">
        <Line data={data} options={options}/>
      </div>
    );
  }
}

export default App;
