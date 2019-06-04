# Forminator

A simple and flexible Javascript form generator and validator. Based on [forms](https://github.com/caolan/forms).

## Installation

Use the package manager **npm** to install forminator.

```bash
npm install --save forminator
```

## Usage
In this example we're using Express and ejs as template engine.

*test.js*
```javascript
const forms = require('forminator');
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

There are 3 ways to validate your form:
```javascript
/**
 * This is the most efficient way.
 * Pro: A new form instance is only generated when 'handle' method is called.
 * Con: The 'submitted' form from handle won't copy any new attributes that you added
 *      or modified after the first form is generated.
 *
 * If that is not a problem, then this is the best method for you.
 */

const TestForm = require('../forms/test');
var test_form = TestForm();

// This won't be in the 'submitted' form
test_form.fields.test._class = 'form-control'

app.get('/', function (req, res) {
  res.render('index', {form: test_form});
});

app.post('/', function (req, res) {
  test_form.handle(req, function(submitted) {
    // The 'test' field in 'submitted' won't contain 'class' attribute 
    // that was applied before.
    if (submitted.isValid) {
      res.send(submitted.fields.test.value);
    }
    else {
      res.render('index', {form: submitted});
    }
  });
});
```
```javascript
/**
 * This is the less headache way.
 * Pro: Customizable form.
 * Con: A new form instance is generated at least twice (at 'GET' + 'POST' route).
 *      (But, I think you already expected this)
 *
 * If you need to do something with the form instance first (ex: dynamically generated 
 * choices for selectField), then use this method.
 */

const TestForm = require('../forms/test');

function Form() {
  var form = TestForm();
  form.fields.test._class = 'form-control';
  return form;
}

app.get('/', function (req, res) {
  var get_form = Form();
  res.render('index', {form: get_form});
});

app.post('/', function (req, res) {
  var post_form = Form();
  post_form.self_handle(req, function(submitted) {
    // post_form === submitted. It doesn't matter which one you use.
    if (submitted.isValid) {
      res.send(submitted.fields.test.value);
    }
    else {
      res.render('index', {form: submitted});
    }
  });
});
```
```javascript
/**
 * Exactly the same as the second one, but with async.
 * Pro: Clean looking code.
 * Con: You need to use an async handler (I use express-async-handler).
 *
 * This method is recommended for cleaner looking code.
 */

const asyncHandler = require('express-async-handler')
const TestForm = require('../forms/test');

function Form() {
  var form = TestForm();
  form.fields.test._class = 'form-control';
  return form;
}

app.get('/', function (req, res) {
  var test_form = Form();
  res.render('index', {form: test_form});
});

app.post('/', asyncHandler(async function (req, res) {
  var test_form = Form();
  if (await test_form.validate(req)) {
    // Form is valid
    res.send(test_form.fields.test.value);
  }
  else {
    // Form contains at least one error
    res.render('index', {form: test_form});
  }
}));
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
```javascript
const TestForm = require('../forms/test');
var form = TestForm();
form.fields.test._class = 'form-control';
````
```javascript
form.fields.test.render({class: 'form-control'});
```
The third method won't accept 'id', 'name', and 'type' attributes. This is intentional.

Note that the attributes only accept string or boolean as their value. So, make sure to convert your numbers into strings first before inserting them.

**Be careful** when adding attributes to your fields.

## Available Fields
- labelField
- inputField
- selectField
- textAreaField

```javascript
var test_form = forms.create({
    // All of the fields accepts attributes.
    // This includes: labels, choices for selectField.

    test2: fields.inputField({
      _type: 'text', // this defaults to 'text'
      label: {text: 'Hello Again!'},
      validators: [
        validators.required('Say something!')
      ]
    }),

    test3: fields.selectField({
      label: {text: 'Howdy!'},
      choices: [
        {_value: 'text', text: 'Text'},
        {_value: 'text2', text: 'Text2'},
        {_value: 'text3', text: 'Text3'}
      ],
      validators: [
        validators.required('Say something!')
      ]
    }),

    test4: fields.textAreaField({
      _disabled: true,
      label: {text: 'Hey!'},
      text: 'Testing this.',
      validators: []
    })
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

*README created using [Make a README](https://www.makeareadme.com/)*
