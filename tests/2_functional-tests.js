
const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // ... (testy #1-#4 zostają bez zmian)
  });

  const Browser = require('zombie');
  Browser.site = "https://boilerplate-mochachai-j1aj.onrender.com/";
  const browser = new Browser();

  suite('Functional Tests with Zombie.js', function () {
    this.timeout(20000);

    // ✅ ZMIANA #1: setup zamiast suiteSetup – działa PRZED KAŻDYM testem
    setup(function (done) {
      browser.visit('/', done); // Reset przeglądarki przed KAŻDYM testem
    });

    suite('Headless browser', function () {
      test('should have a working "site" property', function () {
        assert.isNotNull(browser.site);
      });
    });

    suite('"Famous Italian Explorers" form', function () {
      // #5 – Test Colombo (zostaje bez zmian)
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

      // ✅ ZMIANA #2: Test Vespucci PRZENIESIONY DO ŚRODKA SUITE'U + pressButton
      test('Submit the surname "Vespucci" in the HTML form', function (done) {
        browser.fill('surname', 'Vespucci');
        browser.pressButton('submit', function () { // ✅ BRAKUJĄCE pressButton!
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


