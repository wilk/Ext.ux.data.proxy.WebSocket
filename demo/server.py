#! /usr/bin/env python

from tornado import websocket
from tornado import web
from tornado import ioloop
import string
import random
import json
import sys

sockets = []

def broadcast (msg):
	for socket in sockets:
		socket.write_message (msg)

class EchoWebSocket (websocket.WebSocketHandler):
	def open (self):
		print ('WebSocket open!')
		sockets.append (self)
		with open ('Users.json', 'r') as f:
			users = f.read ()
		users = json.loads (users)
		msg = {"event": "read", "data": users}
		self.write_message (msg)
	
	def id_generator (self, size=5, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
		return ''.join (random.choice (chars) for x in range (size))
	
	def on_message (self, message):
		print ('He sais: ' + message)
		message = json.loads (message)
		
		if message['event'] == 'create':
			with open ('Users.json', 'r') as f:
				users = f.read ()
			users = json.loads (users)
			for d in message['data']:
				d['id'] = self.id_generator ()
				users.append (d)
			with open ('Users.json', 'w') as f:
				f.write (json.dumps (users, indent=5))
			broadcast ({'event':'create', 'data': message['data']})
		
		elif message['event'] == 'read':
			with open ('Users.json', 'r') as f:
				users = f.read ()
				users = json.loads (users)
			msg = {"event": "read", "data": users}
			self.write_message (msg)
		
		elif message['event'] == 'update':
			with open ('Users.json', 'r') as f:
				users = f.read ()
			users = json.loads (users)
			for u in message['data']:
				users = [u if user['id'] == u['id'] else user for user in users]
			with open ('Users.json', 'w') as f:
				f.write (json.dumps (users, indent=5))
			broadcast ({'event':'update', 'data': message['data']})
		
		elif message['event'] == 'destroy':
			with open ('Users.json', 'r') as f:
				users = f.read ()
			users = json.loads (users)
			for user in users:
				if user['id'] == message['data'][0]['id']:
					users.remove (user)
					break
			with open ('Users.json', 'w') as f:
				f.write (json.dumps (users, skipkeys=True, indent=5))
			broadcast ({'event':'destroy', 'data': message['data']})
	
	def on_close (self):
		print ('WebSocket closed')
		sockets.remove (self)

if __name__ == '__main__':
	if (len (sys.argv) <= 1):
		print ('Usage: $ python server.py <port1> <port2> <port3> ...')
		print ('Example: $ python server.py 8888 9999 10000')
		print ('Exit')
	else:
		app = [0]
		
		[app.append (web.Application ([(r"/", EchoWebSocket)])) for i in range (1, len (sys.argv))]
		
		[app[i].listen (int (sys.argv[i])) for i in range (1, len (sys.argv))]
		
		for i in range (1, len (sys.argv)):
			print ('Server listening at %d' % int (sys.argv[i]))
		
		ioloop.IOLoop.instance().start ()
