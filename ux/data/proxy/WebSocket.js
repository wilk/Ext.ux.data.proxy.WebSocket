/**
 * @class Ext.ux.data.proxy.WebSocket
 * @author Vincenzo Ferrari <wilk3ert@gmail.com>
 *
 * HTML5 WebSocket proxy
 */
Ext.define ('Ext.ux.data.proxy.WebSocket', {
	extend: 'Ext.data.proxy.Proxy' ,
	alias: 'proxy.websocket' ,
	
	require: ['Ext.ux.WebSocket'] ,
	
	callbacks: {} ,
	
	config: {
		api: {
			create: 'create' ,
			read: 'read' ,
			update: 'update' ,
			destroy: 'destroy'
		} ,
		
		url: '' ,
		protocol: null ,
		communicationType: 'event'
	} ,
	
	constructor: function (cfg) {
		var me = this;
		
		me.initConfig (cfg);
		me.mixins.observable.constructor.call (me, cfg);
		
		if (Ext.isEmpty (cfg.websocket)) {
			me.ws = Ext.create ('Ext.ux.WebSocket', {
				url: me.url ,
				protocol: me.protocol ,
				communicationType: me.communicationType
			});
		}
		else me.ws = me.websocket;
		
		// TODO: handle incoming data
		// TODO: handle success and failure
		me.ws.on (me.api.create, function (ws, data) {
			me.completeTask (me.api.create);
		});
		
		// TODO: handle success and failure
		me.ws.on (me.api.read, function (ws, data) {
			var resultSet = me.reader.read (data) ,
			    fun = me.callbacks[me.api.read] ,
			    opt = fun.operation;
			
			delete me.callbacks[me.api.read];
			
			opt.resultSet = resultSet;
			opt.records = resultSet.records;
			opt.success = resultSet.success;
			opt.complete = true;
			opt.scope = fun.scope;
			
			// Call the store callback
			fun.callback.apply (fun.scope, [opt]);
		});
		
		// TODO: handle incoming data
		// TODO: handle success and failure
		me.ws.on (me.api.update, function (ws, data) {
			me.completeTask (me.api.update);
		});
		
		// TODO: handle incoming data
		// TODO: handle success and failure
		me.ws.on (me.api.destroy, function (ws, data) {
			me.completeTask (me.api.destroy);
		});
	} ,
	
	create: function (operation, callback, scope) {
		this.runTask (this.api.create, operation, callback, scope);
	} ,
	
	read: function (operation, callback, scope) {
		this.runTask (this.api.read, operation, callback, scope);
	} ,
	
	update: function (operation, callback, scope) {
		this.runTask (this.api.update, operation, callback, scope);
	} ,
	
	destroy: function (operation, callback, scope) {
		this.runTask (this.api.destroy, operation, callback, scope);
	} ,
	
	runTask: function (action, operation, callback, scope) {
		var me = this;
		
		scope = scope || me;
		
		// Callbacks store
		me.callbacks[action] = {
			operation: operation ,
			callback: callback ,
			scope: scope
		};
		
		// Treats 'read' as a string event, with no data inside
		if (action == me.api.read) me.ws.send (action);
		else {
			var data = [];
			
			for (var i=0; i<operation.records.length; i++) {
				data.push (operation.records[i].data);
			}
			
			me.ws.send (action, data);
		}
	} ,
	
	completeTask: function (action) {
		var me = this ,
		    fun = me.callbacks[action] ,
		    opt = fun.operation;
			
		delete me.callbacks[action];
	
		opt.commitRecords (opt.records);
		opt.setCompleted ();
		opt.setSuccessful ();
		
		fun.callback.apply (fun.scope, [opt]);
	}
});
