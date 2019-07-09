const express = require('express');
const next = require('next');

const favicon = require('serve-favicon');
var path = require('path');
let https = require('https')
let fs = require('fs')

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare()
    .then(() => {

        let server = express(), options = {}, PORT = 4000, app = express()

        if (dev) {
            // DEVELOPMENT ///

            // DEVELOPMENT ///  
        }
        else {
            // PRODUCTION ///

            options = {
                ...options,
                key: fs.readFileSync('/etc/letsencrypt/live/rollinglogs.com/privkey.pem', 'utf-8'),
                cert: fs.readFileSync('/etc/letsencrypt/live/rollinglogs.com/fullchain.pem', 'utf-8'),
            }
            // PRODUCTION ///
        }

        server.use(favicon(path.join(__dirname, "/favicon.ico")))

        server.get('/', (req, res) => {
            const actualPage = '/';
            nextApp.render(req, res, actualPage);
        });

        server.get('/test-page', (req, res) => {
            const actualPage = '/test-page';
            nextApp.render(req, res, actualPage);
        });

        server.get('/test/:testParam1/:testParam2', (req, res) => {
            const actualPage = '/test-route';
            const queryParams = {
                vName: req.params.testParam1,
                vId: req.params.testParam2
            };
            nextApp.render(req, res, actualPage, queryParams);
        });


        server.get('*', (req, res) => {
            return handle(req, res)
        });


        server.listen((PORT), (err) => {
            if (err) throw err
            console.log('>> Ready on ' + PORT)
        })


        // if(dev){
        //     // DEVELOPMENT ///
        //     server.listen((PORT), (err) => { 
        //         if (err) throw err
        //         console.log('>> Ready on ' + PORT)
        //     })
        //     // DEVELOPMENT ///
        // }
        // else{
        //     // PRODUCTION ///
        //     app = https.createServer(options, server)
        //     .listen(
        //         PORT,
        //         function(){
        //             console.log("Express server listening on port " + PORT)
        //         }
        //     )

        //     app.on('listening',function(){
        //         console.log('ok, server is running')
        //     })
        //     // PRODUCTION ///
        // }

    })

    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })