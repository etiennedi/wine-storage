/* eslint-disable no-console */
const Rx = require('rxjs/Rx');

const numberOfEntries = process.argv[2] || 100;
const averageSecondsBetweenSteps = process.argv[3] || 3600;

console.log(`Creating ${numberOfEntries} entries with on average ${averageSecondsBetweenSteps} seconds between entries`);

const loggerId = 'fridge_0_zone_0';
const maximumTemperatureDifferencePerEntry = 0.1;
const maximumHumidityDifferencePerEntry = 0.5;

const randomMinusOneToOne = () => 1 - (Math.random() * 2);

const initialData = {
  logger_id: loggerId,
  datetime: 1234567,
  temperature: 10.0,
  humidity: 55,
};

const data$ = Rx.Observable
  .range(1, numberOfEntries)
  .scan(previous => ({
    logger_id: loggerId,
    datetime: previous.datetime +
      (Math.floor(Math.random() * 2 * averageSecondsBetweenSteps)),
    temperature: previous.temperature +
      (randomMinusOneToOne() * maximumTemperatureDifferencePerEntry),
    humidity: previous.humidity +
      (randomMinusOneToOne() * maximumHumidityDifferencePerEntry),
  }), initialData);

data$.subscribe(v => console.log('v', v));
