JSPL      [![Build Status](https://travis-ci.org/jvmvik/jspl.svg?branch=master)](https://travis-ci.org/jvmvik/jspl)
====

JSP Like Template Engine for ExpressJS and NodeJS (based on underscore, support include, cache...)

Features
---
 * JSP Like language to build template.
 * Layout
 * Cache (production)
 * Include HTML fragment
 * Variables: array, string
 * For loop
 * Dynamic evaluate expression 
 
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

Condition: IF
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

Show variable content
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
<%@ template file="templateName" %>
```

 - templateName : Location of the included view without extension. The extension .html will be added automatically.
 - <%@ %>   : Indicate a tag
 - template : Tag name
 - file     : Tag parameter
 
For example:
view.html 

```html
<%@ template file="layout" %>
```

layout.html must include the place where the view is inserted.

```html
<jspl:doLayout>
```
@see: sample/express 
 
Include fragment
---
```
<%@ include file="viewName" %>
```

 - viewName : Location of the included view without extension. The extension .html will be added automatically.
 - <%@ %>  : Indicate a tag
 - include : Tag name
 - file    : Tag parameter

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
But it does not mix well with complex HTML + Javascript Framework like AngularJS. Also, I think software developer should generally minimize the number of transformation that must be done to produce an output.
  
Roadmap
---
 * Improve syntax error message
 * Speed optimization
 
