const express = require('express');
const Parser = require('rss-parser');
const { format } = require('date-fns');
const Nodeparser = require('node-html-parser');

const result= ["https://medium.com/feed/frontendweb","https://medium.com/feed/nextjs"]

var router = express.Router();


let parser = new Parser(
  {
    customFields: {
      item: [["content:encoded", "content"], ["dc:creator", "creator"]]
    }
  }
);



router.get('/', async function handler(req, res) {
  let setData = [];
  let todayArticle = [];

  function htmlImage(params) {

    let img = Nodeparser.parse(params).querySelector('img').getAttribute('src')

    return img;
  }

  function description(params) {

    let text = Nodeparser.parse(params).querySelector('p').innerText

    return text;
  }

  for (let index = 0; index < result.length; index++) {
    const url = result[index]
    let feed = await parser.parseURL(url)
      .then((feed) => {
  
        feed.items.forEach((item) => {
  
  
          var urlparts = item.link.split("?");
  
          setData.push({
            title: item.title,
            link: urlparts[0],
            image: htmlImage(item.content),
            date: item.pubDate,
            description: description(item.content),
            author: item.creator,
            categories: item.categories,
            guid: item.guid
          });
        });
  
      });
    
  }



  if (setData) {

    for (let index = 0; index < setData.length; index++) {

      const todayFormat = format(new Date(), "yyyy-MM-dd");

      const articleDataFormat = format(new Date(setData[index].date), "yyyy-MM-dd");


      if (todayFormat !== articleDataFormat) {
        todayArticle.push(setData[index])
      }

    }

  }


  res.format({
    'application/xml' () {
      res.render('sitemap', { data:{
        articles: todayArticle,
        about: {
          sitename: "My title",
          description: "my description",
          baseUrl:""
          
        }
      } })
    },
  })


}

);


module.exports = router;


