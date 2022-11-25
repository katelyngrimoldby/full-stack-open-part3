const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./testHelper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  await User.insertMany(helper.initialUsers);
}, 60000);

describe('creating users to db', () => {
  test('User is saved to db when created', async () => {
    const reqBody = {
      username: 'katelyngrimoldby',
      name: 'Katelyn Grimoldby',
      password: 'Rival844#'
    };

    const response = await api.post('/api/users').send(reqBody);

    expect(response.body).toEqual(expect.objectContaining({ username: 'katelyngrimoldby', name: 'Katelyn Grimoldby' }));

    const users = await helper.usersInDB();
    expect(users).toHaveLength(helper.initialUsers.length + 1);
  }, 60000);

  test('Error returned if password omitted', async () => {
    const reqBody = {
      username: 'katelyngrimoldby',
      name: 'Katelyn Grimoldby'
    };

    await api.post('/api/users').send(reqBody).expect(400);

    const users = await helper.usersInDB();
    expect(users).toHaveLength(helper.initialUsers.length);
  }, 60000);

  test('Error returned if password too short', async () => {
    const reqBody = {
      username: 'katelyngrimoldby',
      name: 'Katelyn Grimoldby',
      password: 'a',
    };

    await api.post('/api/users').send(reqBody).expect(400);

    const users = await helper.usersInDB();
    expect(users).toHaveLength(helper.initialUsers.length);
  }, 60000);

  test('Error returned if username not unique', async () => {
    const reqBody = {
      username: 'mluukkai',
      name: 'Katelyn Grimoldby',
      password: 'a',
    };

    await api.post('/api/users').send(reqBody).expect(400);

    const users = await helper.usersInDB();
    expect(users).toHaveLength(helper.initialUsers.length);
  }, 60000);
});

afterAll(() => {
  mongoose.connection.close();
});