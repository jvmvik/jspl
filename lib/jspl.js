'use strict';

var fs = require('fs')
var _ = require('underscore');

exports.cache = {};

// TODO Support mustache templating style
// http://underscorejs.org/#template
exports.compile = function(path, data)
{
  var s = fs.readFileSync(path, {encoding:"UTF-8"});
  var template = _.template(include(s));
  return template(data);
}

/*
 * Include file JSP like syntax
 *  - No extension required
 *  - Include something
 *
 * <%@ include file="chunk"%>
 *
 * TODO Test: Support replaceAll should be support by /g
http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
 */
function include(s, data)
{
  return s.replace(
              /<%@\s*include\s*file=['|"|](.*?)['|"|]\s*%>/g,
              function(match, templateId) 
              {
                var path = exports.express.get('views') + '/' + templateId + '.html';
                return exports.compile(path, data);
              }
          );
}
exports.include = include;


/***
 * Bind express application
 */
exports.bind = function(app)
{
  app.engine('html', Render);
  app.set('view engine', 'html');
  exports.express = app;
}

function Render(str, options, fn)
{
  if ('function' == typeof options) 
  {
    fn = options, options = undefined;
  }
  if (typeof fn === 'function') 
  {
    var res
    try 
    {
      res = exports.render(str, options);
    } 
    catch (ex) 
    {
      return fn(ex);
    }
    return fn(null, res);
  }

  options = options || {};

  if(!options.cache)
    return exports.compile(str, options);
  
  if(exports.cache[path])
    exports.cache[path] = exports.compile(str, options);
  
  return exports.cache[path];
};

exports.render = Render;



