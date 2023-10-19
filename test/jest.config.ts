import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test', debug: true, override: true });

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.test.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
