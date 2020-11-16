import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
describe('Sign Tests', () => {
  let userEmail = '';
  it('should register a new user', (done) => {
    var size = 10;
    var charset = 'abcdefghijklmnopqrstuvwxyz';
    var i = 0,
      domain = '';
    while (i++ < size)
      domain += charset.charAt(Math.random() * charset.length);
    const credentials = {
      name: 'Test User',
      email: `${domain}@test.com`,
      password: '1234',
    };
    chai
      .request(app.app)
      .post('/register')
      .send({ credentials })
      .end(function (err, res) {
        if (err) {
          console.log(err.message);
        }
        expect(res).to.have.status(200);
        res.body.should.be.an('object');
        userEmail = res.body.user.email;
        done();
      });
  });
  it('should login', (done) => {
    const credentials = {
      email: 'johndoe@test.com',
      password: '1234',
    };
    chai
      .request(app.app)
      .post('/login')
      .send({ credentials })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });
  after('remove', (done) => {
    chai
      .request(app.app)
      .post('/register/delete')
      .send({ email: userEmail })
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });
});
