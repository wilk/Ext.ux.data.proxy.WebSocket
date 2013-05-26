# Ext.ux.data.proxy.WebSocket

Ext.ux.data.proxy.WebSocket is an easy-to-use implementation of the ExtJS/Sencha Touch proxy, using [**Ext.ux.WebSocket**](https://github.com/wilk/ExtJS-WebSocket) (a HTML5 WebSocket wrapper built for ExtJS and Sencha Touch).

## Requirements
  * [`Ext.ux.WebSocket`](https://github.com/wilk/ExtJS-WebSocket)

## Usage
Load `Ext.ux.data.proxy.WebSocket` via `Ext.require`:

```javascript
Ext.Loader.setConfig ({
	enabled: true
});

Ext.require (['Ext.ux.data.proxy.WebSocket']);
```

Now, you are ready to use it in your code!

First define a new `Ext.data.Model`:

```javascript
Ext.define ('myModel', {
	extend: 'Ext.data.Model' ,
	fields: ['id', 'name', 'age'] ,
	// Ext.ux.data.proxy.WebSocket can be put here in the model or in the store
	proxy: {
		type: 'websocket' ,
		storeId: 'myStore',
		url: 'ws://localhost:8888' ,
		reader: {
			type: 'json' ,
			root: 'user'
		}
	}
});
```

Second create a `Ext.data.Store`:

```javascript
var store = Ext.create ('Ext.data.Store', {
	model: 'myModel',
	storeId: 'myStore'
});
```

Third attach the store to a grid or a chart:

```javascript
var myGrid = Ext.create ('Ext.grid.Panel', {
	title: 'My Grid' ,
	store: store ,
	...
});

var myGrid = Ext.create ('Ext.chart.Chart', {
	title: 'My Chart' ,
	store: store ,
	...
});
```

In the above example, a WebSocket proxy is defined into the model (the same thing can be done into stores): when a CRUD operation is made by its store (through sync/load methods), a 'create'/'read'/'update'/'destroy' event is sent to the server.
At this point, the server intercepts the event, parses the request, and then replies back with the same event.
If you want/need to specify your communication protocol (you wanna CRUD operations like 'createUsers','readUsers','updateUsers','destroyUsers'), just use the api configuration:

```javascript
proxy: {
	type: 'websocket' ,
	storeId: 'myStore',
	url: 'ws://localhost:8888' ,
	api: {
		create:  'createUsers' ,
		read:    'readUsers' ,
		update:  'updateUsers' ,
		destroy: 'destroyUsers'
	} ,
	reader: {
		type: 'json' ,
		root: 'user'
	}
}
```

With this configuration, each sync/load operation made by the store will fire the right CRUD-overridden action.

Now, you're ready to watch the magic in action!

## Run the demo
**I suggest to use [**virtualenv**](http://www.virtualenv.org) to test the demo.**

First of all, you need [**virtualenv**](http://www.virtualenv.org):

```bash
$ sudo apt-get install virtualenv
```

Then, make a virtual environment:

```bash
$ virtualenv venv
```

And install `Tornado`:

```bash
$ . venv/bin/activate
(venv)$ pip install tornado
```

Finally, start the server:

```bash
(venv)$ cd /var/www/Ext.ux.data.proxy.WebSocket/demo/ && python server.py 8888 9999 10000
```

### Python 3+
First of all, install `Tornado`:

```bash
$ sudo apt-get install python3-tornado
```

Then, start the server:

```bash
$ python3.3 /var/www/ExtJS-WebSocket/demo/server.py 8888 9999 10000
```

Now, you have three websockets listening at 8888, 9999 and 10000 port on the server side!
Then, type in the address bar of your browser: **http://localhost/Ext.ux.data.proxy.WebSocket/demo** and play the demo ;)

## Documentation
You can build the documentation (like ExtJS/Sencha Touch Docs) with [**jsduck**](https://github.com/senchalabs/jsduck):

```bash
$ jsduck ux --output /var/www/docs
```

It will make the documentation into docs dir and it will be visible at: http://localhost/docs

## License
The MIT License (MIT)

Copyright (c) 2013 Vincenzo Ferrari <wilk3ert@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
