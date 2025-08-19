const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const initData = require("./data.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
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
    owner: "687cfa4f224329ffb1d9fa0f",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
