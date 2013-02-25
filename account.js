/*jslint white: true, nomen: true, maxlen: 120, plusplus: true, node: true, */
/*global _:false, $:false, define:false, require:false, */
'use strict';

var host = 'http://localhost:3000/',
    request = require('request'),
    params = process.argv.slice(2),
    item;

function addItem(amount, date, callback){
  item = { amount: amount };
  if (typeof date !== 'undefined') {
    item.date = new Date(date + '-00:00:00').getTime();
  }
  request.post(host + 'add', {form: item}, function(error, response, body) {
    if (error) {
      console.log("エラーだよ.");
    }
    if (typeof callback !== 'undefined') { callback(); }
  });
}

function showList(){
  request.get(host + 'list', function(error, response, body) {
    var result = JSON.parse(response.body);
    result.forEach(function(item) {
      var d = new Date(item.date);
      console.log("(" + d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ") " + item.amount + '円');
    });
  });
}
 
function showMonth(month){
  item = {};
  if (typeof month !== 'undefined') {
    var year = new Date().getFullYear(),
        yyyymm = year + ('0' + parseInt(month, 10)).slice(-2);
    request.get(host + 'month?month=' + yyyymm, function(error, response, body) {
      var result = JSON.parse(response.body), sum = 0;
      result.forEach(function(item) {
        sum += item.amount;
      });
      console.log(yyyymm + 'の収支: ' + sum + '円');
    });
  }
  else {
    console.log("ex) node pocket month 12");
  }
}
 
switch(params[0]) {
case 'add':
  addItem(params[1], params[2], function(){
    showList()
  });
  break;

case 'list':
  showList();
  break;

case 'month':
  showMonth(params[1]);
 break;

default:
  console.log("Usage)\n node pocket [add|list|month] params\n");
}
