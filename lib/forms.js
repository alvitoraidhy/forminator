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

  _bind(data, callback) {
    var self = this;
    // Put values into their respective fields;
    if (data != null) {
      for (var x in self.fields) {
        self.fields[x].value = data[self.fields[x]._name];
      }
    }

    // Validate each fields
    self.isValid = true;
    for (var x in self.fields) {
      var isValid = self.fields[x].validate(self);
      if (!isValid && self.isValid) {
        self.isValid = false;
      }
    }

    callback(self);
  }

  _parse(obj, callback) {
    var self = this;
    if (obj instanceof http.IncomingMessage) {
      if (obj.method === 'POST' || obj.method === 'PUT') {
        // If the app is using bodyDecoder for connect or express,
        // it has already put all the POST data into request.body.
        if (obj.body) {
          self._parse(obj.body, callback);
        }
        else {
          var form_parser = new formidable.IncomingForm();
          form_parser.parse(obj, function (err, originalFields/* , files*/) {
            if (err) { throw err; }
            var parsedFields = querystring.parse(querystring.stringify(originalFields));
            self._parse(parsedFields, callback);
          });
        }
      }
      else if (obj.method === 'GET') {
        var qs = parse(obj.url, { parseArrays: false }).query;
        self._parse(querystring.parse(qs), callback);
      }
      else {
        throw new Error('Cannot handle request method: ' + obj.method);
      }
    }
    else if (is.object(obj)) {
      callback(obj);
    }
    else {
      throw new Error('Cannot handle type: ' + typeof obj);
    }
  }

  _async_bind(data) {
    var self = this;
    return new Promise(function(resolve, reject) {
      try {self._bind(data, resolve);}
      catch(err) {reject(err);}
    });
  }

  _async_parse(obj) {
    var self = this;
    return new Promise(function(resolve, reject) {
      try {self._parse(obj, resolve);}
      catch(err) {reject(err);}
    });
  }

  handle(obj, callback) {
    var self = this;
    self._parse(obj, function(result) {
      var bound_form = new Form(self.$fields_generator);
      bound_form._bind(result, callback);
    });
  }

  self_handle(obj, callback) {
    var self = this;
    self._parse(obj, function(result) {
      self._bind(result, callback);
    });
  }

  async validate(obj) {
    var self = this;
    var result = await self._async_parse(obj);
    await self._async_bind(result);

    return self.isValid;
  }
}

exports._class = Form;
exports.fields = require('./fields');
exports.validators = require('./validators');
exports.create = function(fields) {
  return function() {return new Form(fields)}
}