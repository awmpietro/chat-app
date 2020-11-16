import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import io from 'socket.io-client';

chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
describe('Socket Tests', () => {
  let token = '';
  beforeEach('login before each test', function (done) {
    const credentials = {
      email: 'johndoe@test.com',
      password: '1234',
    };
    chai
      .request(app.app)
      .post('/login')
      .send({ credentials })
      .end((err, res) => {
        expect(res).to.have.status(200);
        res.body.should.be.an('object');
        token = res.body.token;
        done();
      });
  });
  it('user connected and able to send msg through socket.', function (done) {
    const client: SocketIOClient.Socket = io(
      `http://localhost:${app.PORT}`,
      { query: { token } },
    );
    client.on('connect', (data) => {
      done();
    });
  });
  it('user able to send and receive msg through socket.', function (done) {
    const client: SocketIOClient.Socket = io(
      `http://localhost:${app.PORT}`,
      { query: { token } },
    );
    client.emit('message', { msg: 'Test Message' });
    client.on('newMessage', (res) => {
      console.log(res);
      expect(res.message).to.equal('Test Message');
    });
    client.disconnect();
    done();
  });
});
