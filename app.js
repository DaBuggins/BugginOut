if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const usersRoutes = require("./routes/users");
const bugRoutes = require("./routes/bugs");
const reviewRoutes = require("./routes/reviews");

const MongoDBStore = require("connect-mongo");

// dev and prod dbUrl, uncomment as necessary
// const dbUrl = "mongodb://127.0.0.1:27017/buggin-out";
const dbUrl = process.env.DB_URL;

mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const secret = process.env.SECRET;

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
});

store.on("error", function (e)
{
  console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
  store,
  name: "sesh",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expres: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://res.cloudinary.com/deskiol0z/image/upload/v1679138840/BugginOut/rxx0hopbzpn0nacmft6y.jpg",
  "https://cdn.jsdelivr.net",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/deskiol0z/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", usersRoutes);
app.use("/bugs", bugRoutes);
app.use("/bugs/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Serving bugs on port ${port}`);
});
