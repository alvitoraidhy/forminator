'use strict';

const http = require('http');
const querystring = require('qs');
const parse = require('url').parse;
const formidable = require('formidable');
const is = require('is');

function cloneObject(obj) {
  var clone = {};
  for (var i in obj) {
    if(obj[i] != null && typeof(obj[i]) === "object" && !is.array(obj[i])) {
      clone[i] = cloneObject(obj[i]);
    }
    else {
      clone[i] = obj[i];
    }
  }
  return clone;
}

exports.fields = require('./fields');
exports.validators = require('./validators');

exports.create = function(fields) {
  return function() {
    var form = {fields};

    // Give default 'id' and 'name' attributes
    for (var x in form.fields) {
      form.fields[x]._id = 'id-' + x;
      form.fields[x]._name = x;
    }

    form.bind = function(data, callback) {
      var bound_form = cloneObject(form);

      // Put values into their respective fields;
      if (data != null) {
        for (var x in bound_form.fields) {
          bound_form.fields[x].value = data[bound_form.fields[x]._name];
        }
      }

      // Validate each fields
      bound_form.isValid = true;
      for (var x in bound_form.fields) {
        var errors = bound_form.fields[x].validate(bound_form);
        bound_form.fields[x].errors = errors;
        if (errors.length > 0) {
          bound_form.isValid = false;
        }
      }

      callback(bound_form);
    }
    
    form.handle = function(obj, callback) {
      if (obj instanceof http.IncomingMessage) {
        if (obj.method === 'POST' || obj.method === 'PUT') {
          // If the app is using bodyDecoder for connect or express,
          // it has already put all the POST data into request.body.
          if (obj.body) {
            form.bind(obj.body, callback);
          }
          else {
            var form_parser = new formidable.IncomingForm();
            form_parser.parse(obj, function (err, originalFields/* , files*/) {
              if (err) { throw err; }
              var parsedFields = querystring.parse(querystring.stringify(originalFields));
              form.bind(parsedFields, callback);
            });
          }
        }
        else if (obj.method === 'GET') {
          var qs = parse(obj.url, { parseArrays: false }).query;
          form.bind(querystring.parse(qs), callback);
        }
        else {
          throw new Error('Cannot handle request method: ' + obj.method);
        }
      }
      else if (is.object(obj)) {
        form.bind(obj, callback);
      }
      else {
        throw new Error('Cannot handle type: ' + typeof obj);
      }
    }
    return form;
  }
}