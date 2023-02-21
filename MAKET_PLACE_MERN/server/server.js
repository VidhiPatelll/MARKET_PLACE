import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();

const routerAuth = require("./routes/router.auth");
const routerInstructor = require("./routes/router.instructor");
const routerCourse = require("./routes/router.course");

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// route
app.use("/api", routerAuth);
app.use("/api", routerInstructor);
app.use("/api", routerCourse);

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
