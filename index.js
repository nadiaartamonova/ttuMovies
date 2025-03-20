const express = require('express')
const app = express()
require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); 



// Middleware for parsing JSON
app.use(express.json())

app.use((req, res, next) => {
    if (req.originalUrl === "/favicon.ico") {
        return res.status(204).end(); 
    }
    next();
});


//auth middleware
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);


// Connect category routes
const categoryRoutes = require('./routes/categoryRoutes')
app.use('/categories',categoryRoutes)


//Actors
const actorRoutes = require('./routes/actorsRoutes')
app.use('/actors',actorRoutes)

//Film
const filmRoutes = require('./routes/filmsRoutes')
app.use('/films',filmRoutes)

//Language
const languageRoutes = require('./routes/languageRoutes')
app.use('/languages',languageRoutes)

//Many-to-many
const filmActorRoutes = require("./routes/filmActorRoutes");
const filmCategoryRoutes = require("./routes/filmCategoryRoutes");

app.use("/film_actor", filmActorRoutes);
app.use("/film_category", filmCategoryRoutes);



// The port on which the server will run
const PORT = process.env.PORT || 3000




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

