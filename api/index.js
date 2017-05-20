const Koa = require('koa');
const route = require('koa-route');
const logger = require('koa-logger');
const cassandra = require('cassandra-driver');

const app = new Koa();
const cassandraClient = new cassandra.Client({ contactPoints: ['127.0.0.1'] });

app.use(logger());

async function getLogEntries(ctx, id) {
  await cassandraClient.connect();
  const query = 'SELECT * FROM temperature_logger.temperature_log WHERE logger_id = ?';
  const result = await cassandraClient.execute(query, [id], { prepare: true });
  ctx.body = result.rows;
}

app.use(route.get('/log-data/:logger_id', getLogEntries));

/* eslint-disable no-console */
app.listen(8000, () => console.log('App listening on port 8000'));
