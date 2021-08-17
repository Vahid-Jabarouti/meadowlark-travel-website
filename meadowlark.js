const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const handlers = require('./lib/handlers')

const app = express()

//configure handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', handlers.home)

app.get('/about', handlers.about)

app.get('/newsletter', handlers.newsletter)

app.get('/newsletter-signup', handlers.newsletterSignup)

app.post('/newsletter-signup', handlers.api.newsletterSignup)

app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)

app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(500).send({error: err.message})
    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})

//info sent to the browser via request header
app.get('/headers', (req, res) => {
  res.type('text/plain')
  const headers = Object.entries(req.headers)
    .map(([key, value]) => `${key}: ${value}`)
  res.send(headers.join('\n'))
})

//custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)

//hiding server info from response headers
app.disable('x-powered-by')

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`
))

