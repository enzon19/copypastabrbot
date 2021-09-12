const app = require('express')();
const path = __dirname + '/status.html'

app.get('/', (req, res) => res.sendFile(path));

console.log("O servidor está supimpamente bem.")

module.exports = () => {
  app.listen(3000);
}
