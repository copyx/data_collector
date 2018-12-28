const chaiHttp = require('chai-http');
const chai = require('chai').use(chaiHttp);

const supertest = require('supertest');
const server = require('../server');
const Data = require('../model/Data');

const request = supertest.agent(server);
chai.should();

describe('/', () => {
  describe('GET', () => {
    it('200을 반환한다', (done) => {
      request
        .get('/')
        .then((res) => {
          res.status.should.be.eql(200);
          done();
        })
        .catch(err => done(err));
    });
  });
});

describe('/collect/data', () => {
  describe('POST', () => {
    describe('데이터를 넘겨줬을 때', () => {
      it('DB에 저장한다.', (done) => {
        request
          .post('/collect/data')
          .send({ content: 'test content' })
          .then((res) => {
            res.status.should.be.eql(200);
            Data.find({})
              .then((data) => {
                data.length.should.be.equal(1);
                done();
              })
              .catch(err => done(err));
          });
      });

      after((done) => {
        Data.deleteMany({})
          .then(() => done())
          .catch(err => done(err));
      });
    });
  });
});
