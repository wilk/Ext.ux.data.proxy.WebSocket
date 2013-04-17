# Ext.ux.data.proxy.WebSocket

ExtJS-WebSocket is an easy-to-use implementation of the ExtJS/Sencha Touch proxy, using [**Ext.ux.WebSocket**](https://github.com/wilk/ExtJS-WebSocket) (a HTML5 WebSocket wrapper built for ExtJS and Sencha Touch).

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

Now, you are ready to use them in your code!

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
(venv)$ python /var/www/Ext.ux.data.proxy.WebSocket/demo/server.py 8888 9999 10000
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
