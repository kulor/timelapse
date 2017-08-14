'use strict'

const express = require('express')
const next = require('next')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 80

const app = next({
  dir: '.',
  dev: process.env.NODE_ENV === 'development'
})

const handle = app.getRequestHandler()
const server = express()

app
  .prepare()
  .then(() => {
    server.get('/:date', (req, res) => {
      return app.render(req, res, '/', req.params)
    })

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => {
      return handle(req, res)
    })

    // Set vary header (good practice)
    // Note: This overrides any existing 'Vary' header but is okay in this app
    server.use(function(req, res, next) {
      res.setHeader('Vary', 'Accept-Encoding')
      next()
    })

    server.listen(process.env.PORT, err => {
      if (err) {
        throw err
      }
      console.log(
        '> Ready on http://localhost:' +
          process.env.PORT +
          ' [' +
          process.env.NODE_ENV +
          ']'
      )
    })
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })
