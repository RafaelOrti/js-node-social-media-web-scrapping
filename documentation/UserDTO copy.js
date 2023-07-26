const hashPassword = require('../src/app/utils/encrypt')

const User = {
  create(user) {
    this.validate(user);
    this.hasValidEmail(user);
    user.password = hashPassword(user.password);
    const {
      name,
      email,
      age,
      city,
      password
    } = user;
    return {
      name,
      email,
      age,
      city,
      password
    };
  },

  format(user) {
    this.validate(user);
    const {
      name,
      email,
      age,
      city
    } = user;
    const formattedName = name.toUpperCase();
    return {
      name: formattedName,
      email,
      age,
      city
    };
  },

  calculateAge(user) {
    this.validate(user);
    const {
      birthdate
    } = user;
    const currentDate = new Date();
    const userBirthdate = new Date(birthdate);
    const ageDiffMs = currentDate - userBirthdate;
    const ageDate = new Date(ageDiffMs);
    const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    return calculatedAge;
  },

  getInitials(user) {
    this.validate(user);
    const {
      name
    } = user;
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials;
  },

  hasValidEmail(user) {
    this.validate(user);
    const {
      email
    } = user;
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  },


  // if (userData.password) {
  //   userData.password = await hashPassword(userData.password);
  // }

  // validate(user) {
  //   const { name, email, age, city, password } = user;

  //   if (!name || !email || !age || !city || !password) {
  //     throw new Error('All fields are required');
  //   }

  //   if (typeof name !== 'string' || typeof email !== 'string' || typeof age !== 'number' || Number.isInteger(age) || typeof city !== 'string' || typeof password !== 'string') {
  //     throw new Error('Invalid field types');
  //   }

  //   if (name.trim().length === 0 || email.trim().length === 0 || city.trim().length === 0 || password.trim().length === 0) {
  //     throw new Error('Fields cannot be empty');
  //   }

  //   if (name.trim() === '' || email.trim() === '' || age <= 0 || city.trim() === '') {
  //     throw new Error('Invalid field values');
  //   }

  //   if (!this.isValidEmail(email)) {
  //     throw new Error('Invalid email format');
  //   }

  //   if (name.length < 2 || name.length > 50) {
  //     throw new Error('Name must be between 2 and 50 characters');
  //   }

  //   if (age < 18 || age > 100) {
  //     throw new Error('Age must be between 18 and 100');
  //   }

  //   if (city.length < 2 || city.length > 50) {
  //     throw new Error('City must be between 2 and 50 characters');
  //   }


  //   //TO DO AVISAR SI FALTA UN CAMPO POR CORREO
  //   //TO DO REUTILIZAR BIEN O NO?

  //   // Agrega más validaciones personalizadas según tus requisitos

  //   return true;
  // },
  validate(user) {
    const {
      name,
      email,
      age,
      city,
      password
    } = user;

    // Check if all fields are present
    if (!name || !email || !age || !city || !password) {
      throw new Error('All fields are required');
    }

    // Check data types of fields
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof age !== 'number' ||
      typeof city !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new Error('Invalid field types');
    }

    // Check if fields are non-empty
    if (name.trim().length === 0 || email.trim().length === 0 || city.trim().length === 0 || age
      .trim().length === 0 || password.trim().length === 0) {
      throw new Error('Fields cannot be empty');
    }

    // Check specific field constraints
    this.validateName(name);
    this.validateEmail(email);
    this.validateAge(age);
    this.validateCity(city);
    this.validatePassword(password);

    // Add more custom validations here, if needed.

    return true;
  },

  validateName(name) {
    if (name.length < 2 || name.length > 50) {
      throw new Error('Name must be between 2 and 50 characters');
    }
  },

  validateEmail(email) {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
  },

  validateAge(age) {
    if (age < 18 || age > 100) {
      throw new Error('Age must be between 18 and 100');
    }
  },

  validateCity(city) {
    if (city.length < 2 || city.length > 50) {
      throw new Error('City must be between 2 and 50 characters');
    }
  },

  validatePassword(password) {
    if (password.length < 8) {
      throw new Error(`Password must be at least ${8} characters long`);
    }
  },

  isValidEmail(email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  }

};

module.exports = User;
