const mongoose = require('mongoose')

async function connect(){
  await mongoose.connect('mongodb+srv://thegangstaguy001:NuLcOmlDKV6UGNoi@cluster0.nh1ewxi.mongodb.net/minecraft?retryWrites=true&w=majority')
  .then((c)=>{
    console.log('Connected to MongoDB')
  })
  .catch((err)=>{
    console.log('Error connecting to MongoDB')
  })
}
module.exports = connect