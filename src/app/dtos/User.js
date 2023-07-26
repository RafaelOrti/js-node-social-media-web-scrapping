const hashPassword = require('../utils/encrypt')
const UserValidations = require('../utils/userValidations');

const User = {
  
  create(user) {
    UserValidations.validate(user);
    // const passwordHashed = hashPassword(user.password);
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
    console.log(user)
    const {
      name,
      email,
      age,
      city,
      password
    } = user;

    const formattedName = name.toUpperCase();
    const validated = UserValidations.validate(user);
    
    if(validated){
      console.log(user.name)
      return {
        name: formattedName,
        email,
        age,
        city,
        password
      };
    }
  },

  calculateAge(user) {
    UserValidations.validate(user);
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
    UserValidations.validate(user);
    const {
      name
    } = user;
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials;
  },

  // Method to mask the user's email (e.g., replace characters with '*')
  maskEmail(user) {
    UserValidations.validate(user);
    const {
      email
    } = user;
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 3) + '*'.repeat(username.length - 3);
    return maskedUsername + '@' + domain;
  },
  // Method to get user data as a JSON string
  toJSON(user) {
    UserValidations.validate(user);
    return JSON.stringify(user);
  },

  // Method to create a user instance from JSON data
  fromJSON(jsonData) {
    const user = JSON.parse(jsonData);
    UserValidations.validate(user);
    return user;
  },
  // Method to get the full name of the user
  getFullName(user) {
    UserValidations.validate(user);
    const {
      name
    } = user;
    return name;
  },

  // Method to set a new age for the user
  setAge(user, newAge) {
    UserValidations.validate(user);
    user.age = newAge;
  },

  // Method to check if the user is an adult (age >= 18)
  isAdult(user) {
    UserValidations.validate(user);
    return user.age >= 18;
  },

  // Method to check if the user's city is a capital city
  isCapitalCity(user) {
    UserValidations.validate(user);
    const {
      city
    } = user;
    const capitalCities = ['Berlin', 'London', 'Paris', 'Madrid', 'Rome']; // Add more if needed
    return capitalCities.includes(city);
  },
};

module.exports = User;
