'use strict';

var fs = require('fs')
var _ = require('underscore');

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
  
  try
  {
    var t = disableInclude ? str : include(str, data);
    var compiled = _.template(t);
    return compiled(data);
  }
  catch(e)
  {
    var msg = "Parsing error:: " + e.message;
    console.warn(msg);
    console.info(e);
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
  return s.replace(
              /<%@\s+include\s+file=['|"|](.*?)['|"|]\s+%>/g,
              function(match, templateId) 
              {
                var path = exports.express.get('views') + '/' + templateId + '.html';
                return exports.compile(path, data, true);
              }
          );
};
exports.include = include;


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



