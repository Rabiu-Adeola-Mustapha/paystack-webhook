require("dotenv").config();
const http = require("http");
const { dbConnection } = require("./db");



const app = require("./app");


const server = http.createServer(app);


PORT = process.env.PORT || 9999 ;


dbConnection()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
      
    })


