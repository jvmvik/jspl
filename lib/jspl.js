'use strict';

var fs = require('fs')
var _ = require('underscore');

// Default settings
var EXT = '.html';

// Cache
exports.cache = {};

// TODO Support mustache templating style
// http://underscorejs.org/#template
exports.compile = function(path, data, disableInclude)
{
  var str;
  try 
  {
    str = fs.readFileSync(path, {encoding:"UTF-8"});
  } 
  catch (e) 
  {
    var msg = "File not found:: " + path;
    console.warn(msg);
    return msg;
  }
  
  var t;
  try
  {
    t = disableInclude ? str : include(str, data);
    t = template(t, data);
    return _.template(t)(data);
  }
  catch(e)
  {
    var msg = "Parsing error: " + e.message + " for " + t;
    console.warn(e.message + ":");
    console.warn(t);
    console.trace(e);
    return msg;
  }
};

/*
 * Include file JSP like syntax
 *  - No extension required
 *  - Include something
 *
 * <%@ include file="chunk"%>
 *
 * Support replaceAll should be support by /g
 * http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
function include(s, data)
{
	return s.replace(/<jspl\s*:\s*include\s*(.*?)\s*[/]*>/g,
              function(match, content) 
              {
				var viewName;
				var regex = /\b(\w+)\b="(.*?)"/g;
				while (match = regex.exec(content))
				{
					if(match[1] == 'file')
					{
						viewName = match[2];
					}
					else
					{
						//console.log("Found", match[1], '=', match[2]);
						data[match[1]] = match[2];
					}
				}  

				if(!viewName)
					throw 'attribute file is missing';

                var path = exports.express.get('views') + '/' + viewName + EXT;
                return exports.compile(path, data, true);
              }
          );
};
exports.include = include;

/*
 * Template processing
 * 
 * View:
 *  <@ template file="layout" %>
 * 
 * Layout:
 *  <jspl:doBody>
 */
function template(content, data)
{
  var regexp = /<jspl\s*:\s*template\s*file=['|"|](.*?)['|"|]\s*\/\s*>/;
  var matches = regexp.exec(content);
  if(!matches || !matches[1])
    return content;

  var templateName = matches[1];
  var path = exports.express.get('views') + '/' + templateName + EXT;
  var layout = exports.compile(path, data, true);
  
  // Clean up view tags: template, html, body
  content = content.replace(/<jspl\s*:\s*template.*\/>/g, "")
              .replace(/<\s*(\/*\s*)*(html)*(body)*\s*>/g, "");
  return layout.replace( /<jspl\s*:\s*doBody\s*[/]*\s*>/g, content);
};
exports.template = template;


/*
 * Bind express application
 */
exports.bind = function(app)
{
  app.engine('html', exports.render);
  app.set('view engine', 'html');
  exports.express = app;
};

/*
 * Render template engine
 */
exports.render = function(path, options, fn)
{
  // Run callback
  if ('function' == typeof options) 
  {
    fn = options, options = undefined;
  }
  if (typeof fn === 'function') 
  {
    var res
    try 
    {
      res = exports.render(path, options);
    } 
    catch (ex) 
    {
      return fn(ex);
    }
    return fn(null, res);
  }

  // Normal processing
  options = options || {};

  if(!options.cache)
  {
    return exports.compile(path, options);
  }    
  
  if(!exports.cache[path])
  {
    exports.cache[path] = exports.compile(path, options);
  }
  return exports.cache[path];
};

/***
 * Set JSPL file extension
 */
exports.setExtension = function(ext)
{
  EXT = ext;
}



