'use strict';

var Faker = require('Faker') ,
    WSS_PORT = 9001 ,
    USER_COUNTER = 10 ,
    users = [] ,
    WebSocketServer = require('ws').Server;

console.log('WebSocketServer :: Initializing users table.');
for (var i = 0; i < USER_COUNTER; i++) {
    users.push({
        id: Faker.Helpers.randomNumber(1000000) ,
        age: Faker.Helpers.randomNumber(100) ,
        name: Faker.Name.firstName(),
        leaf: true
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
        data: {
            data: users,
            success: true
        }
    }));

    ws.send(JSON.stringify({
        event: 'user/read' ,
        data: {
            data: users,
            success: true
        }
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
                data: {
                    data: message.data,
                    success: true
                }
            }));
            wss.broadcast(JSON.stringify({
                event: 'user/create' ,
                data: {
                    data: message.data,
                    success: true
                }
            }));
        }
        else if (event === 'read') {
            ws.send(JSON.stringify({
                event: 'read' ,
                data: {
                    data: users,
                    success: true
                }
            }));
            ws.send(JSON.stringify({
                event: 'user/read' ,
                data: {
                    data: users,
                    success: true
                }
            }));
        }
        else if (event === 'update') {
            message.data.forEach(function (user) {
                var index = -1;
                users.forEach(function (usr, idx) {
                    if (usr.id === user.id) {
                        index = idx;
                        return false;
                    }
                });

                if (index !== -1) users[index] = user;
            });

            wss.broadcast(JSON.stringify({
                event: 'update' ,
                data: {
                    data: message.data,
                    success: true
                }
            }));
            wss.broadcast(JSON.stringify({
                event: 'user/update' ,
                data: {
                    data: message.data,
                    success: true
                }
            }));
        }
        else if (event === 'destroy') {
            message.data.forEach(function (user) {
                var index = -1;
                users.forEach(function (usr, idx) {
                    if (usr.id === user.id) {
                        index = idx;
                        return false;
                    }
                });

                if (index !== -1) users.splice(index, 1);
            });

            wss.broadcast(JSON.stringify({
                event: 'destroy' ,
                data: {
                    data: message.data,
                    success: true
                }
            }));
            wss.broadcast(JSON.stringify({
                event: 'user/destroy' ,
                data: {
                    data: message.data,
                    success: true
                }
            }));
        }
    });
});