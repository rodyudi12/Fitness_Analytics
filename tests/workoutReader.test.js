// Test your workoutReader.js module here
const path = require('path');
const fs = require('fs');
const { readWorkoutData, workoutCalculator } = require('../workoutReader'); // adjust path if needed

const TEST_CSV_FILE = path.join(__dirname, 'test-workouts.csv');

// Sample CSV data for testing
const testCsvData = `date,exercise,duration,calories
2024-01-01,Running,30,300
2024-01-01,Push-ups,15,100
2024-01-02,Cycling,45,400
2024-01-02,Squats,20,150
2024-01-03,Running,35,350
2024-01-03,Pull-ups,10,80
2024-01-04,Yoga,60,200
2024-01-05,Running,40,400
2024-01-05,Bench Press,25,200
2024-01-06,Swimming,50,500`;

beforeAll(() => {
  // Create the test CSV file before running tests
  fs.writeFileSync(TEST_CSV_FILE, testCsvData);
});

afterAll(() => {
  // Clean up test CSV file after tests
  try {
    fs.unlinkSync(TEST_CSV_FILE);
  } catch {}
});

describe('Workout CSV Processing', () => {

  test('readWorkoutData returns correct data structure', async () => {
    const data = await readWorkoutData(TEST_CSV_FILE);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(10);
    expect(data[0]).toHaveProperty('date');
    expect(data[0]).toHaveProperty('exercise');
    expect(data[0]).toHaveProperty('duration');
    expect(data[0]).toHaveProperty('calories');
  });

  test('workoutCalculator returns correct totals', async () => {
    const result = await workoutCalculator(TEST_CSV_FILE);
    expect(result).not.toBeNull();
    expect(result.totalWorkouts).toBe(10);
    expect(result.totalMinutes).toBe(330); // Sum of duration column
  });

  test('workoutCalculator returns null for missing file', async () => {
    const result = await workoutCalculator('missing.csv');
    expect(result).toBeNull();
  });

  test('readWorkoutData throws error for missing file', async () => {
    await expect(readWorkoutData('missing.csv')).rejects.toHaveProperty('code', 'ENOENT');
  });

});
