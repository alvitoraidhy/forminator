const assert = require("assert");
const forms = require('../index');
const fields = forms.fields;
const validators = forms.validators;

// ##########
// inputField
// ##########
describe('The inputField class', function() {
  it('should be a class (Object)', function() {
    assert.strictEqual(fields._classes.inputField instanceof Object, true);
  });

  it('should have \'render\' method', function() {
    assert.strictEqual(fields._classes.inputField.prototype.render instanceof Function, true);
  });

  it('should have \'validate\' method', function() {
    assert.strictEqual(fields._classes.inputField.prototype.validate instanceof Function, true);
  });
});

var input_field = fields.inputField();
describe('The inputField generator', function() {
  it('should be a function', function() {
    assert.strictEqual(true, input_field instanceof Function);
  });

  it('should produce an instance', function() {
    assert.strictEqual(true, input_field() instanceof Object);
  });
});

var iF_instance = input_field();
iF_instance._id = 'id-test-input';
iF_instance._name = 'test-input';
describe('The inputField instance', function() {
  it('should be a class instance (Object)', function() {
    assert.strictEqual(iF_instance instanceof Object, true);
  });

  it('should have \'render\' method', function() {
    assert.strictEqual(iF_instance.render instanceof Function, true);
  });

  it('should have \'validate\' method', function() {
    assert.strictEqual(iF_instance.validate instanceof Function, true);
  });

  it('shouldn\'t be a reference to other inputField instance from the same generator', function() {
    var iF_instance2 = input_field();
    assert.notStrictEqual(iF_instance2, iF_instance);
  });

  it('should have \'label\' instance', function() {
    assert.strictEqual(iF_instance.label instanceof Object, true);
  });

  it('should render the expected label HTML tag', function() {
    iF_instance.label.text = 'test-text'
    assert.strictEqual(iF_instance.label.render(), '<label for="id-test-input">test-text</label>');
  });

  it('should render the expected HTML tag', function() {
    iF_instance._type = 'text';
    iF_instance._class = 'test';
    assert.strictEqual(iF_instance.render(), '<input type="text" id="id-test-input" name="test-input" class="test">');
  });
});

// ##########
// selectField
// ##########

describe('The selectField class', function() {
  it('should be a class (Object)', function() {
    assert.strictEqual(fields._classes.selectField instanceof Object, true);
  });

  it('should have \'render\' method', function() {
    assert.strictEqual(fields._classes.selectField.prototype.render instanceof Function, true);
  });

  it('should have \'validate\' method', function() {
    assert.strictEqual(fields._classes.selectField.prototype.validate instanceof Function, true);
  });
});

var select_field = fields.selectField();
describe('The selectField generator', function() {
  it('should be a function', function() {
    assert.strictEqual(select_field instanceof Function, true);
  });

  it('should produce an instance', function() {
    assert.strictEqual(select_field() instanceof Object, true);
  });
});

var sF_instance = select_field();
sF_instance._id = 'id-test-select';
sF_instance._name = 'test-select';
describe('The selectField instance', function() {
  it('should be a class instance (Object)', function() {
    assert.strictEqual(sF_instance instanceof Object, true);
  });

  it('should have \'render\' method', function() {
    assert.strictEqual(sF_instance.render instanceof Function, true);
  });

  it('should have \'validate\' method', function() {
    assert.strictEqual(sF_instance.validate instanceof Function, true);
  });

  it('shouldn\'t be a reference to other selectField instance from the same generator', function() {
    var sF_instance2 = select_field();
    assert.notStrictEqual(sF_instance2, sF_instance);
  });

  it('should have \'label\' instance', function() {
    assert.strictEqual(sF_instance.label instanceof Object, true);
  });

  it('should render the expected label HTML tag', function() {
    sF_instance.label.text = 'test-text'
    assert.strictEqual(sF_instance.label.render(), '<label for="id-test-select">test-text</label>');
  });

  it('should render the expected HTML tag', function() {
    sF_instance._class = 'test';
    sF_instance.choices = [
      {_value: '1', text: 'test-1'},
      {_value: '2', text: 'test-2'}
    ]
    assert.strictEqual(
      sF_instance.render(),
      '<select id="id-test-select" name="test-select" class="test">' + 
        '<option value="1">test-1</option>' + 
        '<option value="2">test-2</option>' + 
      '</select>',
    );
  });
});

// ##########
// textAreaField
// ##########

describe('The textAreaField class', function() {
  it('should be a class (Object)', function() {
    assert.strictEqual(true, fields._classes.textAreaField instanceof Object);
  });

  it('should have \'render\' method', function() {
    assert.strictEqual(true, fields._classes.textAreaField.prototype.render instanceof Function);
  });

  it('should have \'validate\' method', function() {
    assert.strictEqual(true, fields._classes.textAreaField.prototype.validate instanceof Function);
  });
});

var text_area_field = fields.textAreaField();
describe('The textAreaField generator', function() {
  it('should be a function', function() {
    assert.strictEqual(text_area_field instanceof Function, true);
  });

  it('should produce an instance', function() {
    assert.strictEqual(text_area_field() instanceof Object, true);
  });
});

var tAF_instance = text_area_field();
tAF_instance._id = 'id-test-textarea';
tAF_instance._name = 'test';
describe('The textAreaField instance', function() {
  it('should be a class instance (Object)', function() {
    assert.strictEqual(tAF_instance instanceof Object, true);
  });

  it('should have \'render\' method', function() {
    assert.strictEqual(tAF_instance.render instanceof Function, true);
  });

  it('should have \'validate\' method', function() {
    assert.strictEqual(tAF_instance.validate instanceof Function, true);
  });

  it('shouldn\'t be a reference to other textAreaField instance from the same generator', function() {
    var iF_instance2 = text_area_field();
    assert.notStrictEqual(iF_instance2, tAF_instance);
  });

  it('should have \'label\' instance', function() {
    assert.strictEqual(tAF_instance.label instanceof Object, true);
  });

  it('should render the expected label HTML tag', function() {
    tAF_instance.label.text = 'test-text'
    assert.strictEqual(tAF_instance.label.render(), '<label for="id-test-textarea">test-text</label>');
  });

  it('should render the expected HTML tag', function() {
    tAF_instance._class = 'test';
    assert.strictEqual(tAF_instance.render(), '<textarea id="id-test-textarea" name="test" class="test"></textarea>');
  });
});