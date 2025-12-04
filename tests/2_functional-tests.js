### **Rozwiązanie problemu z testem #6 (`Vespucci`)**  
**Bez zbędnych rozwiązań, tylko konkretne poprawki.**  

---

## **Dlaczego test #6 upada?**  
**Błąd:**  
`AssertionError [ERR_ASSERTION]: No open window with an HTML document`  

**Przyczyna:**  
Test `#6` (**Vespucci**) **nie jest w środku suite'u `"Famous Italian Explorers" form`**, a dodatkowo **nie wywołuje `pressButton('submit')`**.  
**`suiteSetup` działa tylko raz** (przed wszystkimi testami w suite'ach). Po pierwszym teście (Colombo) przeglądarka jest już na **stronie wyników**, a test #6 próbuje wypełnić formularz, którego **już nie ma**.  

---

## **POPRAWNY KOD**  
**Zastosuj te 2 zmiany i testy zadziałają:**

### 1. **Przenieś test #6 do środka suite'u `"Famous Italian Explorers" form`**  
### 2. **Zastąp `suiteSetup` na `setup`** (żeby przed **KAŻDYM** testem wracać do `/`)  

```javascript
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


