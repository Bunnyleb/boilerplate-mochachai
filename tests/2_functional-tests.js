const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=Joanna')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Joanna');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send(
          {
            "surname": "Colombo"
          })

        .end(function (err, res) {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.equal(res.type, 'application/json', 'Response type should be application/json');
          assert.equal(res.body.name, 'Cristoforo', 'Response should be "Cristoforo"' );
          assert.equal(res.body.surname, 'Colombo', 'Response should be "Colombo"');

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
       .request(server)
       .keepOpen()
       .put('/travellers')
       .send(
         {
          "surname": "da Verrazzano"
         })
      .end(function(err, res) {
       assert.equal(res.status,200);
       assert.equal(res.type, "application/json");
       assert.equal(res.body.name, "Giovanni");
       assert.equal(res.body.surname, "da Verrazzano");

       done();
    });
  });

const Browser = require('zombie');
const assert = require('chai').assert; // ✅ MUST import 'assert'

// Set the site URL (use Render or local)
Browser.site = 'https://boilerplate-mochachai-j1aj.onrender.com/';
const browser = new Browser();

suite('Functional Tests with Zombie.js', function () {
  this.timeout(10000); // Increased timeout to handle Render wake-up

  // Navigate to home page once before all tests
  suiteSetup(function (done) {
    browser.visit('/', done); // ✅ No 'return' needed – just pass 'done'
  });

  // --------------------------------------------------
  // 1️⃣ Verify browser configuration
  // --------------------------------------------------
  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  // --------------------------------------------------
  // 2️⃣ Test the form with BOTH surnames
  // --------------------------------------------------
  suite('"Famous Italian Explorers" form', function () {
    // #5 – Test "Colombo"
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      // Fill the form (synchronous)
      browser.fill('surname', 'Colombo');

      // Submit the form (async)
      browser.pressButton('submit', function (err) {
        if (err) return done(err); // Handle errors

        // ✅ EXACT REQUIREMENTS:
        browser.assert.status(200);                     // Assert status is OK 200
        browser.assert.text('span#name', 'Cristoforo'); // Text in span#name
        browser.assert.text('span#surname', 'Colombo'); // Text in span#surname
        browser.assert.elements('span#dates', 1);      // Exactly 1 span#dates

        done(); // Test passed
      });
    });

    // #6 – Test "Vespucci"
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', 'Vespucci');

      browser.pressButton('submit', function (err) {
        if (err) return done(err);

        // ✅ EXACT REQUIREMENTS FOR VESPUCCI:
        browser.assert.status(200);
        browser.assert.text('span#name', 'Amerigo');    // Name for Vespucci
        browser.assert.text('span#surname', 'Vespucci');
        browser.assert.elements('span#dates', 1);

        done();
      });
    });
  });
});
