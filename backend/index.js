const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 8001;
const connectMongoose = require("./connection");
const billRoute = require("./routes/bill")
connectMongoose(
  "mongodb+srv://saxenakushagra198:KushagraSxn@cluster0.jg15md2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log("Mongoose Connected"))
  .catch(() => console.log("Error in connecting Mongoose"));

app.use(
  cors({
    origin: ["http://localhost:5173","https://billgen.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());


app.use("/api/bill", billRoute)
app.listen(PORT, () => console.log("Server Started"));
