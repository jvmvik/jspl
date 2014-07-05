jspl
====

JSP Like Template Engine for ExpressJS and NodeJS (based on underscore, support include, cache...)

Features
---
 * Cache
 * Include HTML fragment
 * Variables
 * Loop
 
see: Gists section
  
Getting started
===
1. Install JSPL
$npm install jspl -save

2. Enable JSPL in Express 4 
Edit app.js, let's JSPL bind to the express app.

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// Enable 
app.set('view cache', false);

// Bind JSPL to express
jspl.bind(app);



Sample: sample/express/

Gists
---
Add variable
---
File: views/index.html 

<h1>Hello <%= name %></h1>

File: app.js

app.get('/', function(req, res)
{
  res.render('index', {name: 'John'});
})

Result:

<h1>Hello John</h1>

For loop
---

File: views/index.html 

<h1>Hello</h1>
<ol>
  <% _.each(people, function(name) { %>
   <li><%= name %></li>
  <% }); %>
</ol>

File: app.js

app.get('/', function(req, res)
{
  res.render('index', {people: ['moe', 'curly', 'larry']});
})

Result:

<h1>Hello</h1>
<ol>
  <li>moe</li>
  <li>curly</li>
  <li>larry</li>
</ol>

Include fragment
---
Include a HTML page into the current one.
<%@ include file="viewName" %>

 - viewName : Location of the included view without extension. The extension .html will be added automatically.
 - <%@ %> : Indicate a tag
 - include : Tag name
 - file    : Tag parameter

Notes
---
The simple template language is very close to JSP.
It's based on underscore.

This project does not provide any advanced JSP tag.
underscore. Compliant with Express. Add the tag include for HTML fragment.

Roadmap
---
 * Improve syntax error message
 * Speed optimization
 