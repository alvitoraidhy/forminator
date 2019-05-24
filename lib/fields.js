'use strict';

const tag = require('html-tag');
const uuidv4 = require('uuid/v4');

exports.labelField = function (options) {
  var field = options;

  field.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field.label).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[x] = field['_' + x];
      }
    }
    var fieldHTML = tag('label', merged_attrs, field.text);
    return fieldHTML;
  }

  return field;
}

exports.inputField = function (options) {
  const default_attrs = ['id', 'name', 'type'];
  
  var field = options;
  var uuid = uuidv4();
  field._type = field._type || 'text';
  field._id = field._id || 'id-' + field._type + '-' + uuid;
  field._name = field._name || field._type + '-' + uuid;

  field.label = field.label || {};
  field.label.text = field.label.text || field._name;
  field.label.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field.label).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[x] = field['_' + x];
      }
    }
    merged_attrs.for = field._id;
    var fieldHTML = tag('label', merged_attrs, field.label.text);
    return fieldHTML;
  }

  field.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined' || default_attrs.includes(key)) {
        merged_attrs[key] = field['_' + key];
      }
    }
    var fieldHTML = tag('input', merged_attrs);
    return fieldHTML;
  }

  field.validate = function(form) {
    var validators = field.validators || [];
    var errors = [];
    for (var x in validators) {
      validators[x](form, field, error => error ? errors.push(error) : null);
    }
    var result = errors;
    return result
  }
  return field;
};

exports.selectField = function (options) {
  var field = options;
  var uuid = uuidv4();
  field._id = field._id || 'id-select-' + uuid;
  field._name = field._name || 'select-' + uuid;

  field.label = field.label || {};
  field.label.text = field.label.text || field._name;
  field.label.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field.label).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[x] = field['_' + x];
      }
    }
    merged_attrs.for = field._id;
    var fieldHTML = tag('label', merged_attrs, field.label.text);
    return fieldHTML;
  }

  field.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[key] = field['_' + key];
      }
    }

    var text = '';
    for (var x in field.choices) {
      var option_merged_attrs = Object.assign({}, attrs);
      var option_filtered_keys = Object.keys(field.choices[x]).filter(x => x[0] === '_');
      for (var y in option_filtered_keys) {
        var key = option_filtered_keys[y].substring(1);
        if (typeof option_merged_attrs[key] === 'undefined') {
          option_merged_attrs[key] = field.choices[x]['_' + key];
        }
      }
      var option_text = field.choices[x].text || field.choices[x]._value;
      var optionHTML = tag('option', option_merged_attrs, option_text);
      text = text + optionHTML + '\n';
    }

    var fieldHTML = tag('select', merged_attrs, text);
    return fieldHTML;
  }

  field.validate = function(form) {
    var validators = field.validators || [];
    var errors = [];
    for (var x in validators) {
      validators[x](form, field, error => error ? errors.push(error) : null);
    }
    var result = errors;
    return result
  }
  return field;
};

exports.textAreaField = function (options) {
  var field = options;
  var uuid = uuidv4();
  field._id = field._id || 'id-textarea-' + uuid;
  field._name = field._name || 'textarea-' + uuid;

  field.label = field.label || {};
  field.label.text = field.label.text || field._name;
  field.label.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field.label).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[x] = field['_' + x];
      }
    }
    merged_attrs.for = field._id;
    var fieldHTML = tag('label', merged_attrs, field.label.text);
    return fieldHTML;
  }

  field.render = function(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(field).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined' || default_attrs.includes(key)) {
        merged_attrs[key] = field['_' + key];
      }
    }
    var fieldHTML = tag('textarea', merged_attrs, field.text);
    return fieldHTML;
  }

  field.validate = function(form) {
    var validators = field.validators || [];
    var errors = [];
    for (var x in validators) {
      validators[x](form, field, error => error ? errors.push(error) : null);
    }
    var result = errors;
    return result
  }
  return field;
};