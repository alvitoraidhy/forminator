'use strict';

const http = require('http');
const querystring = require('qs');
const parse = require('url').parse;
const formidable = require('formidable');
const is = require('is');

class Form {
  constructor(fields) {
    this.$fields_generator = fields;
    this.fields = {};
    for (var x in this.$fields_generator) {
      this.fields[x] = this.$fields_generator[x]();
      this.fields[x]._id = 'id-' + x;
      this.fields[x]._name = x;
    }
  }

  bind_form(data, callback) {
    var bound_form = new Form(this.$fields_generator);

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

  handle(obj, callback) {
    var self = this;
    if (obj instanceof http.IncomingMessage) {
      if (obj.method === 'POST' || obj.method === 'PUT') {
        // If the app is using bodyDecoder for connect or express,
        // it has already put all the POST data into request.body.
        if (obj.body) {
          self.handle(obj.body, callback);
        }
        else {
          var form_parser = new formidable.IncomingForm();
          form_parser.parse(obj, function (err, originalFields/* , files*/) {
            if (err) { throw err; }
            var parsedFields = querystring.parse(querystring.stringify(originalFields));
            self.handle(parsedFields, callback);
          });
        }
      }
      else if (obj.method === 'GET') {
        var qs = parse(obj.url, { parseArrays: false }).query;
        self.handle(querystring.parse(qs), callback);
      }
      else {
        throw new Error('Cannot handle request method: ' + obj.method);
      }
    }
    else if (is.object(obj)) {
      self.bind_form(obj, callback);
    }
    else {
      throw new Error('Cannot handle type: ' + typeof obj);
    }
  }
}

exports._class = Form;
exports.fields = require('./fields');
exports.validators = require('./validators');
exports.create = function(fields) {
  return function() {return new Form(fields)}
}