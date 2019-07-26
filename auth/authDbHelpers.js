const db = require("../database/dbConfig");

module.exports = {
  findByName,
  add
};

function findByName(username) {
  return db("users").where({username}).first();
}

function findById(id){
    return db("users").where({id: id}).first();
}

async function add(newUser) {
  return db("users").insert(newUser).then(ids =>{
      return findById(ids[0])
  })
}

function getAll(){
    return db("users")
}
