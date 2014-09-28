JSPL      [![Build Status](https://travis-ci.org/jvmvik/jspl.svg?branch=master)](https://travis-ci.org/jvmvik/jspl)
====

JSP Like Template Engine for ExpressJS and NodeJS (based on underscore, support include, cache...)

Features
---
 * JSP Like language to build template.
 * Cache (production)
 * Include HTML fragment
 * Variables: array, string
 * For loop
 * Dynamic evaluate expression 
 
see: Example section

Getting started
===
1. Install JSPL
$npm install jspl -save

2. Enable JSPL in Express 4 
```Edit app.js, let's JSPL bind to the express app.

var app = express();

// Disable jade by removing or commenting

//app.set('view engine', 'jade');

// view engine setup

app.set('views', path.join(__dirname, 'views'));

// Disable cache for debug. or set to true: to enable cache in production.

app.set('view cache', false);

// Bind JSPL to express. 

var jspl = require('jspl');
jspl.bind(app);```


Sample
====

An example of application is available under: sample/express/
it shows the template engine in action with express.

Example of code: (GIST)
---
Add variable
---
File: views/index.html 

```
<h1>Hello <%= name %></h1>
```

File: app.js

```
app.get('/', function(req, res)
{
  res.render('index', {name: 'John'});
})
```

Result:

```<h1>Hello John</h1>```

For loop
---

File: views/index.html 

```
<h1>Hello</h1>
<ol>
  <% _.each(people, function(name) { %>
   
   <li><%= name %></li>
   
  <% }); %>
</ol>
```

File: app.js
```
app.get('/', function(req, res)
{
  res.render('index', {people: ['moe', 'curly', 'larry']});
})
```
Result:

```
<h1>Hello</h1>
<ol>
  <li>moe</li>
  <li>curly</li>
  <li>larry</li>
</ol>

```

Include fragment
---
Include a HTML page into the current one.
<%@ include file="viewName" %>

 - viewName : Location of the included view without extension. The extension .html will be added automatically.
 - <%@ %> : Indicate a tag
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
 
