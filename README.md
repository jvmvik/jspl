JSPL      [![Build Status](https://travis-ci.org/jvmvik/jspl.svg?branch=master)](https://travis-ci.org/jvmvik/jspl)
====

JSP Like Template Engine for ExpressJS and NodeJS (based on underscore, support include, cache...)

Features
---
 * JSP Like language to build template.
 * Layout
 * Cache (production)
 * Include HTML fragment
 * Web component capability
 * Variables: array, string
 * For loop
 * Dynamic expression evaluation
 
see: Example section

Getting started
===
1. Install JSPL
```sh
$npm install jspl -save
```

2. Enable JSPL in Express 4 

```javascript
// Edit app.js, let's JSPL bind to the express app.
var app = express();

// Disable jade by removing or commenting
// app.set('view engine', 'jade');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// Disable cache for debug. or set to true: to enable cache in production.
app.set('view cache', false);

// Bind JSPL to express. 
var jspl = require('jspl');
jspl.bind(app);

// Default extension is .html
jspl.setExtension('.jspl');
```

Sample
====

An example of application is available under: sample/express/
it shows the template engine in action with express.

Example of code: (GIST)
---

Condition: if
---
File: views/index.html
```
<% if(user){ %> 
  <%= user.profile.firstName %></p>
<% } %>
```

File: app.js
```
router.get('/', function(req, res) 
{
  res.render('index', {user: {profile: {firstName: 'Mike'} } });
});
```

Display variable content
---
File: views/index.html 

```
<h1>Hello <%= name %></h1>
```

File: app.js

```javascript
app.get('/', function(req, res)
{
  res.render('index', {name: 'John'});
})
```

Result:

```html
<h1>Hello John</h1>
```

For loop
---

File: views/index.html 

```html
<h1>Hello</h1>
<ol>
  <% _.each(people, function(name) { %>
   
   <li><%= name %></li>
   
  <% }); %>
</ol>
```

File: app.js
```html
app.get('/', function(req, res)
{
  res.render('index', {people: ['moe', 'curly', 'larry']});
})
```
Result:

```html
<h1>Hello</h1>
<ol>
  <li>moe</li>
  <li>curly</li>
  <li>larry</li>
</ol>
```

Template 
---

```html
<jspl:template file="templateName" />
```

 - templateName : Location of the included view without extension. The extension .html will be added automatically.
 - ```<jspl: />```  : Indicate a tag
 - template : Name of the tag
 - file     : Template file location 
 
For example:
view.html 

```html
<jspl:template file="layout" />
```

layout.html must include the place where the view is inserted.

```html
<jspl:doLayout>
```
@see: sample/express 
 
Include fragment
---
```
<jspl:include file="chunk" attr1="value1" attr2="value2" />
```

 - viewName   : Location of the included view without extension. The extension .html will be added automatically.
 - ```<jspl: />```  : Indicate a tag
 - include    : Tag name
 - file       : File name (mandatory)
 - parameters : Optional parameters.
 
The file chunk is located under the view directory.

Example:

views/index.html
```
<jspl:include file="web_component" planet="venus" system="solar"/></html>
```

views/web_component.html
```
<h1><%= planet %></h1><h2><%= system %></h2>
``` 

Output
```
<html><h1>venus</h1>\n<h2>solar</h2>\n</html>
```

Testing
---
This template engine build is animate by a complete regression test suite.

Notes
---
The simple template language is very close to JSP.
It's based on underscore.

This project does not provide any advanced JSP tag.
underscore. Compliant with Express. Add the tag include for HTML fragment.

Motivation
---

I do not like Jade or whatever short HTML template engine. I understand why it's a good solution for basic website.
But Jade do not mix well with complex HTML + Javascript Framework like AngularJS. Also, I think software developer should generally minimize the number of transformation that must be done to produce an output. 
And I have a pretty bad experience with EJS.
For example EJS fails badly if you try to run a simple if condition.
  
Roadmap
---
 * Improve syntax error message
 * Speed optimization
 
