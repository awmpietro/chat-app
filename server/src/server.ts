const MyApp = require('./app');

const app = new MyApp();
app.server.listen(app.PORT, () => {
  console.log(`Server listening at ${app.PORT}`);
});
