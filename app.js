const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const port = 3000;
const app     = express();

// STEP 1: Setting up the boilerplate and routing
// app.get('/', function(req, res){
//
//   //All the web scraping magic will happen here
//   res.send('Hello World!');
//
// });

// STEP 2: Making a request to another URL
// app.get('/', function(req, res){
//
//   const url = 'https://en.wikipedia.org/wiki/Phyllotaxis';
//
//   // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
//   request(url, function(error, response, html) {
//     if(!error) {
//       res.send(html);
//     }
//   });
//
// });

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
app.use(express.static('html'));
app.get('/scrape', function(req, res){

  const root_url = 'https://en.wikipedia.org';
  const sub_url = '/wiki/Botany';

  // structure of our request call is: first parameter is URL with a callback function that has 3 parameters
  request(root_url+sub_url, function(error, response, html) {
    if(!error) {

      const $ = cheerio.load(html);
      let data;

      let data_store = {
        title: '',
        image: '',
        firstParagraph: '',
        firstUrl: ''
      };

      // let's filter with cheerio to only get the content of the article
      $('#content').filter(function(){
        data_store.title = $(this).find('#firstHeading').text();
        data_store.image = $(this).find('#bodyContent').first().find('img').attr('src');
        data_store.firstParagraph = $(this).find('#bodyContent').first().find('p').not('.mw-empty-elt').first().text();
        data_store.firstUrl = root_url + $(this).find('#bodyContent').first().find('p').not('.mw-empty-elt').first().find('a').first().attr('href');
      });

      // To write to the system we will use the built in 'fs' library.
      // In this example we will pass 3 parameters to the writeFile function
      // Parameter 1 :  output.json - this is what the created filename will be called
      // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
      // Parameter 3 :  callback function - a callback function to let us know the status of our function
      fs.writeFile('./html/output.js', 'const output_data = ' + JSON.stringify(data_store, null, 4), function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
      });

      res.send(data_store);
    }
  });
});


app.listen(port);
console.log('Magic happens on port ' + port);

exports = module.exports = app;