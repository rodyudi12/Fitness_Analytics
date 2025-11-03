require('dotenv').config(); // Load environment variables
const path = require('path');
const { readHealthFile } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

async function processFiles() {
  const userName = process.env.USER_NAME || 'User';
  const weeklyGoal = Number(process.env.WEEKLY_GOAL) || 0;

  console.log(`Processing data for: ${userName}`);

  try {
    // --- Read Workout Data ---
    console.log('Reading workout data...');
    const workoutFilePath = path.join(__dirname, 'data', 'workouts.csv');
    const workoutResult = await workoutCalculator(workoutFilePath);

    // --- Read Health Data ---
    console.log('Reading health data...');
    const healthFilePath = path.join(__dirname, 'data', 'health-metrics.json');
    const totalHealthEntries = await readHealthFile(healthFilePath);

    // --- SUMMARY ---
    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workoutResult?.totalWorkouts ?? 0}`);
    console.log(`Total workout minutes: ${workoutResult?.totalMinutes ?? 0}`);
    console.log(`Health entries found: ${totalHealthEntries ?? 0}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (workoutResult) {
      if (workoutResult.totalMinutes >= weeklyGoal) {
        console.log(`Congratulations ${userName}! You have exceeded your weekly goal!`);
      } else {
        console.log(`Keep going ${userName}! You have ${weeklyGoal - workoutResult.totalMinutes} minutes left to meet your weekly goal.`);
      }
    }

  } catch (error) {
    console.log('An unexpected error occurred:', error.message);
  }
}

// Run the main function
processFiles();
