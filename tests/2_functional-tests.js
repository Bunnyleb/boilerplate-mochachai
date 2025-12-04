
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const Browser = require('zombie');

suite('Functional Tests', function () {
  this.timeout(5000);

  // #1-#4: Integration tests with chai-http
  suite('Integration tests with chai-http', function () {
    test('Test GET /hello with no name', function (done) {
      chai.request(server).keepOpen().get('/hello').end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'hello Guest');
        done();
      });
    });

    test('Test GET /hello with your name', function (done) {
      chai.request(server).keepOpen().get('/hello?name=Joanna').end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'hello Joanna');
        done();
      });
    });

    test('Send {surname: "Colombo"}', function (done) {
      chai.request(server).keepOpen().put('/travellers').send({ surname: "Colombo" }).end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.name, 'Cristoforo');
        assert.equal(res.body.surname, 'Colombo');
        done();
      });
    });

    test('Send {surname: "da Verrazzano"}', function (done) {
      chai.request(server).keepOpen().put('/travellers').send({ surname: "da Verrazzano" }).end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.name, "Giovanni");
        assert.equal(res.body.surname, "da Verrazzano");
        done();
      });
    });
  });

  // #5-#6: Functional Tests with Zombie.js
  Browser.site = "https://boilerplate-mochachai-j1aj.onrender.com/";
  const browser = new Browser();

  suite('Functional Tests with Zombie.js', function () {
    this.timeout(20000);

    setup(function (done) {
      browser.visit('/', done);
    });

    suite('Headless browser', function () {
      test('should have a working "site" property', function () {
        assert.isNotNull(browser.site);
      });
    });

    suite('"Famous Italian Explorers" form', function () {
      test('Submit the surname "Colombo" in the HTML form', function (done) {
        browser.fill('surname', 'Colombo');
        browser.pressButton('submit', function () {
          browser.assert.success();
          browser.assert.text('span#name', 'Cristoforo');
          browser.assert.text('span#surname', 'Colombo');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });

      test('Submit the surname "Vespucci" in the HTML form', function (done) {
        browser.fill('surname', 'Vespucci');
        browser.pressButton('submit', function () {
          browser.assert.success();
          browser.assert.text('span#name', 'Amerigo');
          browser.assert.text('span#surname', 'Vespucci');
          browser.assert.elements('span#dates', 1);
          done();
        });
      });
    });
  });
});
