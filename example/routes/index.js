const asyncHandler = require('express-async-handler');
const TestForm = require('../forms/test');

exports.init = function(current) {
  var app = current.app;
  var form = TestForm();

  // GET index
  app.get('/', function(req, res, next) {
    res.render('index', {form});
  });

  // POST index
  app.post('/', function(req, res, next) {
    form.handle(req, function(submitted) {
      console.log(submitted);
      res.render('index', {form: submitted});
    })
  });

  function PopulatedForm() {
    var form = TestForm();
    form.fields.test3.choices.push({_value: 'text4', text: 'Text4'})
    return form;
  }

  // GET async
  app.get('/async', function(req, res, next) {
    var get_form = PopulatedForm();
    console.log(get_form);
    res.render('index', {form: get_form});
  });

  // POST async
  app.post('/async', asyncHandler(async function(req, res, next) {
    var post_form = PopulatedForm();
    if (await post_form.validate(req)) {
      console.log(post_form);
      res.render('index', {form: post_form});
    }
    else {
      console.log(post_form);
      console.log('INVALID FORM');
      res.render('index', {form: post_form}); 
    }
  }));
}