'use strict';

const tag = require('html-tag');
const uuidv4 = require('uuid/v4');

const default_attrs = ['id', 'name', 'type'];

exports.inputField = function (options) {
  var classes = {}
  var field = options;
  field._type = field._type || 'text';
  field._id = field._id || 'id-' + field._type + '-' + uuidv4();
  field._name = field._name || field._type + '-' + uuidv4();

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