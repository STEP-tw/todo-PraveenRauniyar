let app = require("./app.js").app
const http = require('http');
const PORT = 8888;
let server = http.createServer(app);
server.on('error', e => console.error('**error**', e.message));
server.listen(PORT, (e) => console.log(`server listening at ${PORT}`));
