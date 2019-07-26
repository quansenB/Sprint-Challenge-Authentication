const db = require("../database/dbConfig");

module.exports = {
  findBy,
  add
};

function findBy(filter) {
  return db("user").where(filter);
}

async function add(newUser) {
  const id = await db("user").insert(newUser);
  return findBy(id);
}
