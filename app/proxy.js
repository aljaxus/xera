var http = require('http')
var request = require('request')

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  console.log(req)

  try {
    if (!!req && !!req.url && String(req.url).length >= 1) {
      const queryString = String(req.url).slice(1)
      console.log(queryString)

      request({
        url: queryString,
      }).on('error', function (e) {
        res.end(e)
      }).pipe(res)
    } else {
      res.end('no url found')
    }
  } catch (error) {
    console.error(error)
  }
}).listen(3000)
