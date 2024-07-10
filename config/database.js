const mongoose = require("mongoose");
console.log("Helll-----")
const connectDatabase = () => {
  mongoose.set("strictQuery", false);
    // mongoose
    //     .connect(process.env.DB_URI)
    //     .then((data) => {
    //         console.log(`Mongodb connected with server: ${data.connection.host}`);
    //     });
    mongoose.connect(
      "mongodb://localhost:27017/",
      {
        dbName: "CRM",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) =>
        err ? console.log(err) : console.log(
          "Connected to yourDB-name database")
    );
};

module.exports = connectDatabase;
