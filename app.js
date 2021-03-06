"use strict"

var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(express.static('static'))
app.use(bodyParser.json())


const registerRoutes = function(app, routes) {
    /*
    route = {
        method,
        path,
        func,
    }
    */
    for (let i = 0; i < routes.length; i++) {
        let route = routes[i]
        app[route.method](route.path, route.func)
    }
}

const routeModules = [
    './route/index',
    './route/todo',
    './route/login',
    './route/project',
    // './route/comment'
]

for (let i = 0; i < routeModules.length; i++) {
    let routes = require(routeModules[i])
    registerRoutes(app, routes)
}

const server = app.listen(8082, function(){
    var host = server.address().address
    var port = server.address().port

    console.log('todo 开启, 访问地址为 http://%s:%s', host, port);
})

require('./model/comment').run(server)
