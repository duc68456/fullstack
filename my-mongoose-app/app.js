// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://23520303_db_user:1718943649@cluster0.lmstc2q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

  //   const kittySchema = new mongoose.Schema({
  //   name: String
  //   });

  //   // NOTE: methods must be added to the schema before compiling it with mongoose.model()
  //   kittySchema.methods.speak = function speak() {
  //   const greeting = this.name
  //       ? 'Meow name is ' + this.name
  //       : 'I don\'t have a name';
  //   console.log(greeting);
  //   };

  //   const Kitten = mongoose.model('Kitten', kittySchema);

  //   const silence = new Kitten({ name: 'Silence' });
  //   console.log(silence.name); // 'Silence'

  //   const fluffy = new Kitten({ name: 'fluffy' });
  //   // await fluffy.save();
  //   fluffy.speak(); 

  //   const kittens = await Kitten.find();
  //   console.log(kittens);
  //   console.log('breakhere');
  //   await Kitten.find({ name: /^fluff/ });

  // // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

  // ---------------------------

  const schema = new mongoose.Schema({
    _id: Number
  });

  const Model = mongoose.model('Test', schema);

  const doc = new Model({
    _id: 5
  });

  await doc.save();
}