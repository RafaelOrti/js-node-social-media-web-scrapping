const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
const userStructure = require('../../config/UserStructure');
const userSchema = new mongoose.Schema(userStructure);
const toJSONConfig = {
  transform: (doc,ret,opt) => {//transform es un metodo de mongoose
      delete ret['password']//ret es un metodo encripta la password para enviarla con mas seguridad
      return ret
  }
}
userSchema.set('toJSON', toJSONConfig);
const User = mongoose.model('User', userSchema);
module.exports = User;
