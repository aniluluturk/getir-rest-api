//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.PORT = 8081;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let config = require('config');
let mongoose = require('mongoose');

//retrieve config vars
const uri = config.get('app.mongoose.uri');

chai.use(chaiHttp);

describe('Records Test', function () {
    this.timeout(120000);
    before(function (done) {
        mongoose.connect(uri, {useNewUrlParser: true}, function (error) {
            console.log('conn ready:  ' + mongoose.connection.readyState);
            mongoose.connection.readyState.should.be.eql(1);
        }).catch(function () {
            console.warn('cannot connect to the db, tests will fail');
        })
        .then(() => {
            done();
        });
    });

    describe('/GET /', function () {
        this.timeout(5000);
        it('should get the welcome page', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql({code: 0, msg: 'Welcome to REST Api'});
                    done();
                });
        });
    });

    describe('/GET /records', function () {
        this.timeout(5000);
        it('should get error message on GET request for /records', (done) => {
            chai.request(server)
                .get('/records')
                .end((err, res) => {
                    res.should.have.status(404);
                    //res.text.should.contain('Cannot GET /records');
                    done();
                });
        });
    });

    describe('/GET /records/record_id', function () {
        this.timeout(5000);
        var recordId = '58adc5172a84567a19698e1e';
        it('should get record with given id', (done) => {
            chai.request(server)
                .get('/records/' + recordId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.be.eql({});
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    res.body.record._id.should.contain('58adc5172a84567a19698e1e');
                    done();
                });
        });
    });

    describe('/POST /records with no params', function () {
        //pessimistic timeout
        this.timeout(15000);
        it('should get all results from db', (done) => {
            var params = {
                minCount: 0,
                maxCount: 1000,
                startDate: '2016-01-01',
                endDate: '2018-01-01',
            };
            chai.request(server)
                .post('/records')
                .set('content-type', 'application/x-www-form-urlencoded')
                //.send(params)
                .timeout(10000)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.be.eql({});
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    res.body.records.length.should.be.eql(12000);
                    done();
                });
        });
    });

    describe('/POST /records with zero-length date and count params', function () {
        this.timeout(10000);
        it('should get no results (invalid parameter range)', (done) => {
            var params = {
                minCount: 1001,
                maxCount: 1000,
                startDate: '2017-01-02',
                endDate: '2017-01-01',
            };
            chai.request(server)
                .post('/records')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(params)
                .timeout(10000)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    res.body.records.length.should.be.eq(0);
                    done();
                });
        });
    });

    describe('/POST /records with date and count params', function () {
        this.timeout(10000);
        it('should get filtered results from db', (done) => {
            var params = {
                minCount: 0,
                maxCount: 1000,
                startDate: '2016-01-01',
                endDate: '2018-01-01',
            };
            chai.request(server)
                .post('/records')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(params)
                .timeout(10000)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    res.body.records.length.should.be.lessThan(12000);
                    done();
                });
        });
    });

    describe('/POST /records with count between 1 and 1000', function () {
        this.timeout(10000);
        it('should get records whose counts lie between 0 and 1000', (done) => {
            var params = {
                minCount: 0,
                maxCount: 1000,
                startDate: '2016-01-01',
                endDate: '2018-01-01',
            };
            chai.request(server)
                .post('/records')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(params)
                .timeout(10000)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    var records = res.body.records;
                    records = records.map((x) => x['totalCount']).filter((x) => (x < 0 || x > 1000));
                    records.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST /records with count above 1000', function () {
        this.timeout(10000);
        it('should get records whose counts lie above 1000 (no record below this count)', (done) => {
            var params = {
                minCount: 1000,
            };
            chai.request(server)
                .post('/records')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(params)
                .timeout(10000)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    var records = res.body.records;
                    records = records.map((x) => x['totalCount']).filter((x) => (x < 1000));
                    records.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST /records with createdAt after 2017-01-01', function () {
        this.timeout(10000);
        it('should get records with creation date after 2017-01-01 (no record before this date)', (done) => {
            var params = {
                startDate: '2017-01-01',
            };
            chai.request(server)
                .post('/records')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(params)
                .timeout(10000)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.code.should.be.eql(0);
                    res.body.msg.should.be.eql('success');
                    var records = res.body.records;
                    var d = new Date(params.startDate);
                    records = records.map((x) => x['createdAt']).filter((x) => (new Date(x) < d));
                    records.length.should.be.eql(0);
                    done();
                });
        });
    });

    after(function (done) {
        mongoose.disconnect().then(() => {
            done();
        });
    });

});
