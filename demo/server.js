'use strict';

var Faker = require('Faker') ,
    _ = require('lodash') ,
    WSS_PORT = 9001 ,
    USER_COUNTER = 10 ,
    users = [] ,
    WebSocketServer = require('ws').Server;

console.log('WebSocketServer :: Initializing users table.');
for (var i = 0; i < USER_COUNTER; i++) {
    users.push({
        id: Faker.Helpers.randomNumber(1000000) ,
        age: Faker.Helpers.randomNumber(100) ,
        name: Faker.Name.firstName()
    });
}
console.log('WebSocketServer :: Users table initialization done!');

var wss = new WebSocketServer({port: WSS_PORT}, function (err) {
    if (err) {
        console.log('Impossible to start the websocket server.');
        console.log(err);

        process.exit();
    }

    console.log('WebSocketServer :: listening on port ' + WSS_PORT);
});

wss.broadcast = function (data) {
    this.clients.forEach(function (ws) {
        ws.send(data);
    });
};

wss.on('connection', function (ws) {
    console.log('WebSocket :: connected');

    ws.send(JSON.stringify({
        event: 'read' ,
        data: users
    }));

    ws.on('message', function (json) {
        var message = JSON.parse(json) ,
            event = message.event;

        console.log('WebSocket :: event == ' + event);
        console.log('WebSocket :: data == ');
        console.log(message.data);

        if (event === 'create') {
            message.data.forEach(function (user) {
                user.id = Faker.Helpers.randomNumber(1000000);
                users.push(user);
            });

            wss.broadcast(JSON.stringify({
                event: 'create' ,
                data: message.data
            }));
        }
        else if (event === 'read') {
            ws.send(JSON.stringify({
                event: 'read' ,
                data: users
            }));
        }
        else if (event === 'update') {
            message.data.forEach(function (user) {
                var index = _.find(users, {id: user.id});
                users[index] = user;
            });

            wss.broadcast(JSON.stringify({
                event: 'update' ,
                data: message.data
            }));
        }
        else if (event === 'destroy') {
            message.data.forEach(function (user) {
                var index = _.find(users, {id: user.id});
                delete users[index];
            });

            wss.broadcast(JSON.stringify({
                event: 'destroy' ,
                data: message.data
            }));
        }
    });
});