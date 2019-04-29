const fetch = require('node-fetch')
const path = require('path');
const express = require('express')
const requestIp = require('request-ip')
const PORT = process.env.PORT || 5001;
const app = express()
app.use(requestIp.mw())
app.get('/', (req, res) => {
  console.log(req.clientIp)
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('/info', (req, res) => {

  console.log(req.clientIp);
  if(!req.clientIp.includes('185.199.111.153') && !req.clientIp.includes('127.0.0.1')) {
    console.log('IP Error');
    res.status(401).json({
      code: 401,
      data: 'Not allowed IP address'
    })
    return
  }

  console.log(req.query.userId)
  const url = `https://blog.csdn.net/${req.query.userId}/article/list/`
  const titleRegx = new RegExp(
    '<span class="article-type type-.*?">\n.*?</span>\n(.*?)</a>',
    'g'
  )
  const regx = new RegExp(
    '<span class="read-num">阅读数 <span class="num">(.*?)</span> </span>',
    'g'
  )

  let result = []
  async function getInfo(i) {
    let response
    try {
      response = await fetch(url + i)
      const body = await response.text()
      const titles = body.match(titleRegx)
      const visits = body.match(regx)
      let pageData = titles.map((title, i) => {
        return {
          title: title.substring(63, title.length - 5).trim(),
          count: +visits[i].match(/\d+/)[0]
        }
      })
      result = [...result, ...pageData]
      // console.log(pageData)
    } catch (err) {
      console.log('Error')
    }
  }
  const pageLength = +req.query.pageNum || 10
  const pages = [...new Array(pageLength).keys()].map(i => i + 1)
  async function processArray(array) {
    for (const item of array) {
      await getInfo(item)
    }
    console.log('Done!')
    res.set({
      "Access-Control-Allow-Origin" : "*"
    })
    res.json({
      code: 200,
      total: result.length,
      data: result
    })
  }

  processArray(pages)
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
