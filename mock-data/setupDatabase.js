/* eslint-disable no-console */
const cassandra = require('cassandra-driver');
const Rx = require('rxjs/Rx');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] });

const createKeyspaceQuery = `
  CREATE KEYSPACE temperature_logger
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
`;

const createTableQuery = `
  CREATE TABLE temperature_logger.temperature_log (
    logger_id text,
    datetime timestamp,
    temperature float,
    humidity float,
    PRIMARY KEY (logger_id, datetime)
  );
`;

const errorHandling = errors => errors.do(() => console.log('Cassandra is not ready yet, retyring in 2s')).delay(2000);

const dbConnection = Rx.Observable.of(1)
  .switchMap(() => Rx.Observable.of(1).switchMap(() => client.connect()))
  .retryWhen(errorHandling)
  .do(() => console.log('connected to cassandra, creating keyspaces next'))
  .switchMap(() => client.execute(createKeyspaceQuery))
  .do(() => console.log('keyspaces created, creating table next'))
  .switchMap(() => client.execute(createTableQuery))
  .do(() => console.log('table succesfully created'));

dbConnection.subscribe(undefined,
  (e) => { console.error(e); process.exit(1); },
  () => process.exit());
