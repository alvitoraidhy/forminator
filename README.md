# Reforms

A basic and flexible Javascript form generator and validator. Based on [forms](https://github.com/caolan/forms).

Currently only **<input>** field is generate-able at the moment.
Other fields such as **<select>** will be added later.

## Installation

Use the package manager **npm** to install reforms.

```bash
npm install --save reforms
```

## Usage
In this example we're using Express and ejs as template engine.

*forms.js*
```javascript
const forms = require('../reforms');
const fields = forms.fields;
const validators = forms.validators;
 
var test_form = forms.create({
    test: fields.inputField({
      _type: 'text',
      label: {text: 'Hello There!'},
      validators: [validators.required('Say something!')]
    })
});

module.exports = test_form;
```
*index.js*
```javascript
. . .

const TestForm = require('../forms/test');

var test_form = TestForm();

// GET Index
app.get('/', function (req, res) {
  res.render('index', {form: test_form});
});

// POST Index
app.post('/', function (req, res) {
  test_form.handle(req, function(submitted) {
    if (submitted.isValid) {
      res.send(submitted.fields.test.value);
    }
    else {
      res.send(submitted.fields.test.errors);
    }
  });
});

. . .
```

*index.ejs*
```html
<h1>Hello World!</h1>
<form method="POST" class="form">
  <%- form.fields.test.label.render() %>
  <%- form.fields.test.render() %>
  <button type="submit">Attend</button>
</form>
```
This would produce:
```html
<h1>Hello World!</h1>
  <form method="POST" class="form">
    <label for="id-test">Hello There!</label>
    <input type="text" id="id-test" name="test">
    <button type="submit">Attend</button>
</form>
```

You can add attributes to your tags like this:
```javascript
var test_form = forms.create({
  test: fields.inputField({
    _type: 'text',
    _class: 'form-control', // Note the '_' on _type and _class
    // You can even do this:
    _trashattribute: 'this is useless', // Will be inserted as well
    label: {text: 'Hello There!', _class: 'red bold'},
    validators: [validators.required('Say something!')]
  })
});
```
Or:
```javascript
form.fields.test.render({class: 'form-control'});
```
**Be careful** when adding attributes to your fields.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

*README created using [Make a README](https://www.makeareadme.com/)*