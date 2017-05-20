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
  datetime: Date.now(),
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

const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });

const insertStatement = `
  INSERT INTO temperature_logger.temperature_log
  (logger_id, datetime, temperature, humidity)
  VALUES (?, ?, ?, ?)
  `;

const dbConnection = Rx.Observable.fromPromise(client.connect())
  .switchMap(() => client.execute('TRUNCATE temperature_logger.temperature_log;'))
  .mergeMap(() => data$)
  .map(singleEntry => ({
    query: insertStatement,
    params: Object.values(singleEntry),
  }))
  .toArray()
  .switchMap(queries => client.batch(queries, { prepare: true }))
  .map(() => client.shutdown())
  .catch((err) => {
    console.error('There was an error when connecting', err);
    return client.shutdown();
  });

dbConnection.subscribe();
