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
  });
});