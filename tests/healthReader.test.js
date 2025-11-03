const path = require('path');
const fs = require('fs/promises');
const { readHealthFile } = require('../healthReader'); // <-- fixed path

const TEST_FILE = path.join(__dirname, 'test-health.json');

const testData = {
  user: 'Alex',
  metrics: [
    { date: '2024-01-01', type: 'sleep', duration: '7.5' },
    { date: '2024-01-01', type: 'nutrition', calories: '2100' },
    { date: '2024-01-02', type: 'sleep', duration: '8.0' },
    { date: '2024-01-02', type: 'nutrition', calories: '2250' },
    { date: '2024-01-03', type: 'sleep', duration: '6.5' },
    { date: '2024-01-03', type: 'nutrition', calories: '2000' },
    { date: '2024-01-04', type: 'sleep', duration: '7.8' },
    { date: '2024-01-04', type: 'nutrition', calories: '2300' }
  ]
};

beforeAll(async () => {
  await fs.writeFile(TEST_FILE, JSON.stringify(testData));
});

afterAll(async () => {
  try {
    await fs.unlink(TEST_FILE);
  } catch {}
});

describe('readHealthFile', () => {
  test('reads a valid JSON file and returns the healthData object', async () => {
    const result = await readHealthFile(TEST_FILE);
    expect(result).not.toBeNull();
    expect(result.user).toBe('Alex');
    expect(result.metrics).toHaveLength(8);
  });

  test('validates first and last entries of metrics', async () => {
    const result = await readHealthFile(TEST_FILE);
    expect(result.metrics[0]).toEqual({ date: '2024-01-01', type: 'sleep', duration: '7.5' });
    expect(result.metrics[7]).toEqual({ date: '2024-01-04', type: 'nutrition', calories: '2300' });
  });

  test('returns null when the file is missing', async () => {
    const result = await readHealthFile('missing.json');
    expect(result).toBeNull();
  });

  test('returns null when JSON is invalid', async () => {
    const invalidFile = path.join(__dirname, 'invalid.json');
    await fs.writeFile(invalidFile, "{ invalid json }");

    const result = await readHealthFile(invalidFile);
    expect(result).toBeNull();

    await fs.unlink(invalidFile);
  });
});
