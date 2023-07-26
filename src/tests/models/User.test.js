const mongoose = require('mongoose');
const User = require('../../app/models/User');

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to the in-memory database
    await mongoose.connect('mongodb://localhost/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the in-memory database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear the database after each test
    await User.deleteMany();
  });

  describe('Create User', () => {
    it('should create and save a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const newUser = new User(userData);
      const savedUser = await newUser.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).toBe(userData.password);
      expect(savedUser.createdAt).toBeDefined();
    });

    it('should require the name, email, and password fields', async () => {
      const user = new User({});

      let error;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should require a unique email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await User.create(userData);

      const duplicateUser = new User(userData);

      let error;
      try {
        await duplicateUser.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });
  });
});
