#! /usr/bin/env python

from tornado import websocket
from tornado import web
from tornado import ioloop
import json
import sys

class EchoWebSocket (websocket.WebSocketHandler):
	def open (self):
		print 'WebSocket open!'
	
	def on_message (self, message):
		print 'He sais: ' + message
		if message == 'read':
			msg = {"event": "read" ,"data": {"user": {"id": 10 ,"name": "Lollo" ,"age": 20}}}
			self.write_message (msg)
		else:
			message = json.loads (message)
			if message['event'] == 'create':
				self.write_message ('create')
			elif message['event'] == 'update':
				self.write_message ('update')
			elif message['event'] == 'destroy':
				msg = {"event": "destroy" ,"data": {"user": {"id": 10 ,"name": "Lollo" ,"age": 20}}}
				self.write_message ('destroy')
	
	def on_close (self):
		print 'WebSocket closed'

if __name__ == '__main__':
	if (len (sys.argv) <= 1):
		print 'Usage: $ python server.py <port1> <port2> <port3> ...'
		print 'Example: $ python server.py 8888 9999 10000'
		print 'Exit'
	else:
		app = [0]
		
		[app.append (web.Application ([(r"/", EchoWebSocket)])) for i in range (1, len (sys.argv))]
		
		[app[i].listen (int (sys.argv[i])) for i in range (1, len (sys.argv))]
		
		for i in range (1, len (sys.argv)):
			print 'Server listening at %d' % int (sys.argv[i])
		
		ioloop.IOLoop.instance().start ()
