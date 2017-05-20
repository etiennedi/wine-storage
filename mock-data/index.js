const Rx = require('rxjs/Rx');

const numberOfEntries = process.argv[2] || 100;
const averageSecondsBetweenSteps = process.argv[3] || 3600;

console.log(`Creating ${numberOfEntries} entries with on average ${averageSecondsBetweenSteps} seconds between entries`);

const logger_id = "fridge_0_zone_0"
const maximumTimeDifferencePerEntry = 0.2;
const maximumHumidityDifferencePerEntry = 1;

const initialData = {
  logger_id,
  datetime: 1234567,
  temperature: 10.0,
  humidity: 55,
}

const data$ = Rx.Observable
  .range(1,numberOfEntries)
  .scan((previous) => {
    return {
      logger_id,
      datetime: previous.datetime + Math.floor(Math.random(0,1) * averageSecondsBetweenSteps),
    }
  }, initialData)

data$.subscribe( v=> console.log('v', v))
