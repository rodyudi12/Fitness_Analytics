const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function readWorkoutData(filepath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const absolutePath = path.resolve(filepath);

    if (!fs.existsSync(absolutePath)) {
      return reject({ code: 'ENOENT', message: 'File not found' });
    }

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}


async function workoutCalculator(filepath) {
  try {
    const workoutData = await readWorkoutData(filepath);

    let totalWorkouts = workoutData.length;
    let totalMinutes = 0;

    for (let i = 0; i < workoutData.length; i++) {
      // Convert duration/duration column to number (handle strings)
      const minutes = Number(workoutData[i].duration?.trim());
      if (!isNaN(minutes)) totalMinutes += minutes;
    }

    console.log("Total workouts:", totalWorkouts);
    console.log("Total minutes:", totalMinutes);

    return { totalWorkouts, totalMinutes };

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('CSV file not found - check the file path');
    } else {
      console.log('Error processing CSV file:', error.message);
    }
    return null;
  }
}

// Example usage
workoutCalculator('./data/workouts.csv');

module.exports = { readWorkoutData, workoutCalculator };
