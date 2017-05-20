const numberOfEntries = process.argv[2] || 100;
const averageSecondsBetweenSteps = process.argv[3] || 3600;

console.log(`Creating ${numberOfEntries} entries with on average ${averageSecondsBetweenSteps} seconds between entries`);
