const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const initData = require("./data.js");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/../.env" });
}

let dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68a260dfb68d83a3e6de11aa",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
