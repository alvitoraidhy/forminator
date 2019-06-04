const forms = require('forminator');
const fields = forms.fields;
const validators = forms.validators;
 
var test_form = forms.create({
    test: fields.inputField({
      _type: 'text',
      label: {text: 'Hello There!'},
      validators: [validators.required('Say something!')]
    }),
    test2: fields.inputField({
      _type: 'text',
      label: {text: 'Can you repeat that?'},
      validators: [
        validators.required('Say something!'), 
        validators.matchField('test',"You're inconsistent!")
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

module.exports = test_form;