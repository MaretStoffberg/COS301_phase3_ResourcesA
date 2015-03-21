Templates should e compiled to js files using:
	handlebars name.handlebars -mf name.js

Move the output file to /public/javascript/
Include the javascript in your server-side template
Use Handlebars.templates.name(context) 
OR  andlebars.templates["name"](context) to apply template

Seee client-template.handlebars and test.hbs as examples

