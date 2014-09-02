var expect = require('expect');
var jspl = require('jspl');

describe('JSPL regression', function()
{
  beforeEach(function()
  {
    var express = function()
    {
      return {
        get: function(views)
        {
          return 'test/data';
        },
        engine: function(k, v){},
        set: function(k, v){}
      }
    };
    jspl.bind(express());
  });
  
  describe('Include', function()
  {  
    it('basic include file', function()
    {
      var s = jspl.include('<html><%@ include file="chunk" %></html>');
      expect(s).toBe('<html><h2>I\'m a chunk !!</h2></html>', {});
    });    
    
    it('variables && include', function()
    {
      var s = jspl.include('<html><%@ include file="chunk2" %></html>',{title: "Header"});
      expect(s).toBe('<html><h1>Header</h1></html>');
    });   
    
    
    it('variables && include && loop', function()
    {
      var s = jspl.include('<html><%@ include file="loop2" %></html>',{head: "Header",people:['Mike', 'Bob', 'Henry']});
      expect(s).toBe('<html><h2>Header</h2>\n<ol>\n\n<li>Mike</li>\n\n<li>Bob</li>\n\n<li>Henry</li>\n\n</ol></html>');
    });   
    
  });
  
  describe('Compile', function()
  {
    it('simple', function()
    {
      var s = jspl.compile('test/data/simple.html', {name: 'Victor'});
      expect(s).toBe('<h1>Hello Victor</h1>\n');
    });
    
    it('for loop', function()
    {
      var s = jspl.compile('test/data/loop.html', {people:['Mike', 'Bob', 'Henry']});
      expect(s).toBe('<ol>\n<li>Mike</li>\n<li>Bob</li>\n<li>Henry</li>\n</ol>');
    });
    
    it('for loop without data', function()
    {
      try
      {
        var s = jspl.compile('test/data/loop.html', {});
        expect(s).toBe('');
      }
      catch(e)
      {expect(e.message).toBe('people is not defined');}
    });
    
    it('mixed loop and variable', function()
    {
        var s = jspl.compile('test/data/variableLoop.html', {header:'Test', prime:[1,2,3]});
        expect(s).toBe('<h1>Test</h1>\n<ol>\n<li>1</li>\n<li>2</li>\n<li>3</li>\n</ol>');
     
    });
  });
  
  // Render
  describe('Render', function(done)
  {
    it('Variables && include && loop', function(done)
    {
      var json = {title: "Header 1", head: 'Header 2', people:['Mike']};
      var s = jspl.render('test/data/render.html', json);
      expect(s).toBe('<html>\n<h1>Header 1</h1>\n<h2>Header 2</h2>\n<ol>\n\n<li>Mike</li>\n\n</ol>\n</html>');
    }); 
    
    it('Render a simple loop', function()
    {
      var s = jspl.render('test/data/loop2.html',{title: "Header 1", head: 'Header 2', people:['Mike', 'Bob', 'Henry']});
      expect(s).toBe('<h2>Header 2</h2>\n<ol>\n\n<li>Mike</li>\n\n<li>Bob</li>\n\n<li>Henry</li>\n\n</ol>');
    });    
  });
});