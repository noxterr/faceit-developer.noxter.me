var express        = require("express");
var bodyParser     = require("body-parser");
var cookieParser   = require("cookie-parser");
var cookieSession  = require("cookie-session");
var passport       = require("passport");
var faceitStrategy = require("passport-faceit").Strategy;
var dotenv         = require("dotenv");
dotenv.config();

var app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({secret:"somesecrettokenhere"}));
app.use(passport.initialize());
app.use(express.static("./public"));

passport.use(new faceitStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  function(accessToken, refreshToken, params, profile, done) {
    const userData = jwt.decode(params.id_token);

    done(null, {
      faceitId: userData.guid,
      faceitAvatar: userData.picture,
      faceitEmail: userData.email,
      faceitNickname: userData.nickname
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", function(req, res) {
    res.render("index");
});

app.get("/auth/faceit", passport.authenticate("faceit"));
app.get("/auth/faceit/callback", passport.authenticate("faceit", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

app.listen(3000);