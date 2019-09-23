// Storing dependencies into a variable
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Storing port number and our full app
var port = 8081;
var app = express();

app.get('/wikipedia', function(req, res){
  var url = 'https://en.wikipedia.org/wiki/Phyllotaxis';
  request(url, function(error, response, html) {

    if( !error ) {
      var $ = cheerio.load(html);
      var data = {
        articleTitle : '',
        articleImg : '',
        articleParagraph: ''
      };
      $('#content').filter(function(){
        data.articleTitle = $(this).find('#firstHeading').text();
        data.articleImg = $(this).find('img').first().attr('src');
        data.articleParagraph = $(this).find('p:nth-of-type(2)').text();
      });
      res.send(data);

      fs.writeFile('wiki-output.js', JSON.stringify(data, null, 4), function(error){
        console.log('File written on hard drive!');
      });

    }
  });
});

app.get('/imdb', function(req, res){

  var url = 'https://www.imdb.com/chart/top';

  request(url, function(error, response, html) {

    if( !error ) {
      var $ = cheerio.load(html);

      var data = [];

      $('.lister-list').filter(function(){
        $(this).find('tr').each(function(i, elem){
          data[i] = "'" + $(this).find('.posterColumn').find('img').attr('src') + "'";
        });
      });

      res.send(data);

      fs.writeFile('imdb-output.js', 'var imdb_list = [' + data + ']', function(error){
        console.log('File written on hard drive!');
      });
    }

  });
});

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;








// STEP 3: Traversing the DOM
// app.get('/', function(req, res){
//
//   const root_url = 'https://en.wikipedia.org';
//   const sub_url = '/wiki/Phyllotaxis';
//
//   // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
//   request(root_url+sub_url, function(error, response, html) {
//     if(!error) {
//
//       const $ = cheerio.load(html);
//       let data;
//
//       let data_store = {
//         title: '',
//         image: '',
//         firstParagraph: '',
//         firstUrl: ''
//       };
//
//       // let's filter with cheerio to only get the content of the article
//       $('#content').filter(function(){
//         data_store.title = $(this).find('#firstHeading').text();
//         data_store.image = $(this).find('img').attr('src');
//         data_store.firstParagraph = $(this).find('p').first().text();
//         data_store.firstUrl = root_url + $(this).find('p').first().find('a').first().attr('href');
//       });
//
//       res.send(data_store);
//     }
//   });
//
// });

// STEP 4: Formatting and saving to your hard drive
// app.get('/', function(req, res){
//
//   const root_url = 'https://en.wikipedia.org';
//   const sub_url = '/wiki/Botany';
//
//   // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
//   request(root_url + sub_url, function(error, response, html) {
//     if(!error) {
//
//       const $ = cheerio.load(html);
//       let data;
//
//       let data_store = {
//         title: '',
//         image: '',
//         firstParagraph: '',
//         firstUrl: ''
//       };
//
//       // let's filter with cheerio to only get the content of the article
//       $('#content').filter(function(){
//         data_store.title = $(this).find('#firstHeading').text();
//         data_store.image = $(this).find('#bodyContent').first().find('img').attr('src');
//         data_store.firstParagraph = $(this).find('#bodyContent').first().find('p').not('.mw-empty-elt').first().text();
//         data_store.firstUrl = root_url + $(this).find('#bodyContent').first().find('p').not('.mw-empty-elt').first().find('a').first().attr('href');
//       });
//
//       // To write to the system we will use the built in 'fs' library.
//       // In this example we will pass 3 parameters to the writeFile function
//       // Parameter 1 :  output.json - this is what the created filename will be called
//       // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
//       // Parameter 3 :  callback function - a callback function to let us know the status of our function
//       fs.writeFile('./html/output.js', 'const output_data = ' + JSON.stringify(data_store, null, 4), function(err){
//         console.log('File successfully written! - Check your project directory for the output.json file');
//       });
//
//       res.send(data_store);
//     }
//   });
// });

// STEP 5: Serving static html files
// app.use(express.static('html'));
// app.get('/scrape', function(req, res){
//
//   const root_url = 'https://en.wikipedia.org';
//   const sub_url = '/wiki/Botany';
//
//   // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
//   request(root_url+sub_url, function(error, response, html) {
//     if(!error) {
//
//       const $ = cheerio.load(html);
//       let data;
//
//       let data_store = {
//         title: '',
//         image: '',
//         firstParagraph: '',
//         firstUrl: ''
//       };
//
//       // let's filter with cheerio to only get the content of the article
//       $('#content').filter(function(){
//         data_store.title = $(this).find('#firstHeading').text();
//         data_store.image = $(this).find('#bodyContent').first().find('img').attr('src');
//         data_store.firstParagraph = $(this).find('#bodyContent').first().find('p').not('.mw-empty-elt').first().text();
//         data_store.firstUrl = root_url + $(this).find('#bodyContent').first().find('p').not('.mw-empty-elt').first().find('a').first().attr('href');
//       });
//
//       // To write to the system we will use the built in 'fs' library.
//       // In this example we will pass 3 parameters to the writeFile function
//       // Parameter 1 :  output.json - this is what the created filename will be called
//       // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
//       // Parameter 3 :  callback function - a callback function to let us know the status of our function
//       fs.writeFile('./html/wiki_output.js', 'const output_data = ' + JSON.stringify(data_store, null, 4), function(err){
//         console.log('File successfully written! - Check your project directory for the output.json file');
//       });
//
//       res.send(data_store);
//     }
//   });
// });

// INSTAGRAM HASHTAG
// app.use(express.static('html'));
// app.get('/scrape', function(req, res){
//
//   const root_url = 'https://instagram.com';
//   const hashtag = 'selfie';
//   const sub_url = '/explore/tags/'+ hashtag +'/?__a=1';
//
//   // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
//   request(root_url+sub_url, function(error, response, html) {
//     if(!error) {
//
//       const $ = cheerio.load(html);
//       let data_store = $.text();
//
//       // To write to the system we will use the built in 'fs' library.
//       // In this example we will pass 3 parameters to the writeFile function
//       // Parameter 1 :  output.json - this is what the created filename will be called
//       // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
//       // Parameter 3 :  callback function - a callback function to let us know the status of our function
//       fs.writeFile('./html/instagram_output.js', 'const output_data = ' + data_store, function(err){
//         console.log('File successfully written! - Check your project directory for the output.json file');
//       });
//
//       res.send(html);
//     }
//   });
// });

// IMDB
// app.use(express.static('html'));
// app.get('/scrape', function(req, res){
//
//   const root_url = 'https://www.imdb.com';
//   const sub_url = '/chart/top?ref_=nv_mv_250';
//
//   // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
//   request(root_url+sub_url, function(error, response, html) {
//     if(!error) {
//
//       const $ = cheerio.load(html);
//
//       let data_store = [];
//
//       // let's filter with cheerio to only get the content of the article
//       $('.lister').filter(function(){
//         $(this).find('tr').each(function(i, elem) {
//           data_store[i] = "'"+$(this).find('.posterColumn').find('img').attr('src')+"'";
//         });
//       });
//
//       // To write to the system we will use the built in 'fs' library.
//       // In this example we will pass 3 parameters to the writeFile function
//       // Parameter 1 :  output.json - this is what the created filename will be called
//       // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
//       // Parameter 3 :  callback function - a callback function to let us know the status of our function
//       fs.writeFile('./html/imdb_output.js', 'const output_data = [' + data_store + ']', function(err){
//         console.log('File successfully written! - Check your project directory for the output.json file');
//       });
//
//       res.send(data_store);
//     }
//   });
// });
