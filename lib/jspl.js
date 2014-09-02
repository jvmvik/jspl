'use strict';

var fs = require('fs')
var _ = require('underscore');

exports.cache = {};

// TODO Support mustache templating style
// http://underscorejs.org/#template
exports.compile = function(path, data, c)
{
  var s = fs.readFileSync(path, {encoding:"UTF-8"});
  var t = c ? s : include(s, data);
  return _.template(t, data);
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
              /<%@\s*include\s*file=['|"|](.*?)['|"|]\s*%>/g,
              function(match, templateId) 
              {
                var path = exports.express.get('views') + '/' + templateId + '.html';
                return exports.compile(path, data, true);
              }
          );
};
exports.include = include;


/***
 * Bind express application
 */
exports.bind = function(app)
{
  app.engine('html', exports.render);
  app.set('view engine', 'html');
  exports.express = app;
};

exports.render = function(path, options, fn)
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
      res = exports.render(path, options);
    } 
    catch (ex) 
    {
      return fn(ex);
    }
    return fn(null, res);
  }

  options = options || {};

  if(!options.cache)
    return exports.compile(path, options);
  
  if(exports.cache[path])
    exports.cache[path] = exports.compile(path, options);
  
  return exports.cache[path];
};



