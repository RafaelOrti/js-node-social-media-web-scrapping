const UserValidations = {
  validateId(id) {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      console.error('Invalid ID');
    }
    return id;
  },

  validateFilter(filter) {
    if (!filter || typeof filter !== 'string' || filter.trim().length === 0) {
      console.error('Invalid filter parameter. Should be a non-empty string if provided.');
    }
    return filter;
  },

  getFilterAndSort(req) {
    const filterValidated = UserValidations.validateFilter(req.query.filter);
    const filter = filterValidated ? { archiveDate: { $exists: req.query.filter } } : {};
    const sortBy = filterValidated === 'true' ? { 'archiveDate': 'desc' } : { 'date': 'desc' };
    return { filter, sortBy };
  },

  validate(user) {
    const { name, email, age, city, password } = user;

    // Check if all fields are present
    if (!name || !email || !age || !city || !password) {
      console.error('All fields are required');
    }

    // Check data types of fields
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof age !== 'number' ||
      typeof city !== 'string' ||
      typeof password !== 'string'
    ) {
      console.error('Invalid field types');
    }


    // Check if fields are non-empty
    if (name.trim().length === 0 || email.trim().length === 0 || city.trim().length === 0 || age.toString().trim().length === 0 || password.trim().length === 0) {
      console.error('Fields cannot be empty');
    }

    // Check specific field constraints
    UserValidations.validateName(name);

    UserValidations.validateEmail(email);

    UserValidations.validateAge(age);

    UserValidations.validateCity(city);

    UserValidations.validatePassword(password);

    // Add more custom validations here, if needed.

    return true;
  },

  validateName(name) {
    if (name.length < 2 || name.length > 50) {
      console.error('Name must be between 2 and 50 characters');
    }
    return name;
  },

  validateEmail(email) {
    if (!UserValidations.isValidEmail(email)) {
      console.error('Invalid email format');
    }
    return email;
  },

  validateAge(age) {
    if (age < 18 || age > 200) {
      console.log(age)
      console.error('Age must be between 18 and 200');
    }
    return age;
  },

  validateCity(city) {

    if (city.length < 2 || city.length > 50) {
      console.error('City must be between 2 and 50 characters');
    }
    return city;
  },

  validatePassword(password) {

    if (password.length < 8) {
      console.error(`Password must be at least ${8} characters long`);
    }
    return password;
  },

  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log(emailRegex.test(email))
    return emailRegex.test(email);
  },

};

module.exports = UserValidations;
