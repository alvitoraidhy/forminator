const forms = require('../index');
const fields = forms.fields;
const validators = forms.validators;
 
var test_form = forms.create({
    test: fields.inputField({
      _type: 'text',
      label: {text: 'Hello There!'},
      validators: [validators.required('Say something!')]
    }),
    test3: fields.selectField({
      label: {text: 'Howdy!'},
      choices: [
        {_value: 'text', text: 'Text'},
        {_value: 'text2', text: 'Text2'},
        {_value: 'text3', text: 'Text3'}
      ],
      validators: [
        validators.required('Say something!'),
        validators.matchChoices()
      ]
    }),
    test4: fields.textAreaField({
      _disabled: true,
      label: {text: 'Hey!'},
      text: 'Testing this.',
      validators: []
    })
});

var assert = require("assert");

var Form = forms._class;
describe('The Form class', function() {
  it('should be a class (Object)', function() {
    assert.strictEqual(Form instanceof Object, true);
  });
  it('should have \'handle\' method', function() {
    assert.strictEqual(Form.prototype.handle instanceof Function, true);
  });

  it('should have \'bind_form\' method', function() {
    assert.strictEqual(Form.prototype.bind_form instanceof Function, true);
  });
});

describe('The form generator', function() {
  it('should be a function', function() {
    assert.strictEqual(test_form instanceof Function, true);
  });
  it('should produce an instance', function() {
    assert.strictEqual(test_form() instanceof Object, true);
  });
});

var form_instance = test_form();
describe('The form instance', function() {
  it('should be a class instance (Object)', function() {
    assert.strictEqual(form_instance instanceof Object, true);
  });

  it('should have \'handle\' method', function() {
    assert.strictEqual(form_instance.handle instanceof Function, true);
  });

  it('should have \'bind_form\' method', function() {
    assert.strictEqual(form_instance.bind_form instanceof Function, true);
  });

  it('shouldn\'t be a reference to other form instance from the same generator', function() {
    var form_instance2 = test_form();
    assert.notStrictEqual(form_instance2, form_instance);
  });
});

form_instance.handle({}, function(bound_form) {
  describe('The bound form instance', function() {
    it('should be a class instance (Object)', function() {
      assert.strictEqual(bound_form instanceof Object, true);
    });

    it('should be invalid', function() {
      assert.notStrictEqual(bound_form.isValid, true);
    });
  });
});