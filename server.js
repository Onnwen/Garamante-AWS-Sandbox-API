const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

/* Headers setting */
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
});

/* Routes */
app.use("/", require("./routes/works"));

/* Error handler */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({message_error: err.message});
});

app.listen(port, () => {
    console.log(`Garamante AWS Sandbox API running at https://api.garamante.it/sandbox`);
    console.log(`Local path: http://localhost:${port}`);
});