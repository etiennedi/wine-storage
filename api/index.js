const Koa = require('koa');
const route = require('koa-route');
const logger = require('koa-logger');
const cassandra = require('cassandra-driver');
const cors = require('koa-cors');

const app = new Koa();
const cassandraClient = new cassandra.Client({ contactPoints: ['winestorage_db_1'] });

app.use(logger());
app.use(cors());

async function getLogEntries(ctx, id) {
  try {
    await cassandraClient.connect();
    const query = 'SELECT * FROM temperature_logger.temperature_log WHERE logger_id = ?';
    const result = await cassandraClient.execute(query, [id], { prepare: true });
    ctx.body = result.rows;
  } catch (error) {
    ctx.statusCode = 500;
    ctx.body = error;
  }
}

app.use(route.get('/log-data/:logger_id', getLogEntries));

/* eslint-disable no-console */
app.listen(8000, () => console.log('App listening on port 8000'));
