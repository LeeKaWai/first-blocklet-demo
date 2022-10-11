const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.BLOCKLET_PORT || 3500;

app.use(express.urlencoded({extended: false})); 
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req, res) => {
    res.send('Hello, this is leekawai first blocklet demo')
})

const dirRequire = dir => {
    fs.readdirSync(dir).forEach(file => {
        const controllerName = file.split(".js")[0];
        const filePath = dir + "/" + file;
        if (fs.statSync(filePath).isDirectory()) {
        dirRequire(filePath);
        } else {
        const router = express.Router();
        require(filePath)(router);
        app.use("/api/" + controllerName, router);
        }
    });
};

dirRequire(path.join(__dirname, "app/controllers"));

app.listen(port,(err)=> {
    if(err) {
        throw err;
    }
    console.log("create api app server on port " + port);
})

