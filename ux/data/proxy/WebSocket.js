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
	
	store: null ,
	
	config: {
		storeId: '' ,
		api: {
			create: 'create' ,
			read: 'read' ,
			update: 'update' ,
			destroy: 'destroy'
		} ,
		url: '' ,
	} ,
	
	protocol: null ,
	
	constructor: function (cfg) {
		var me = this;
		
		me.initConfig (cfg);
		me.mixins.observable.constructor.call (me, cfg);
		
		if (me.getStoreId () == '') {
			Ext.Error.raise ('The storeId field is needed!');
			return false;
		}
		
		if (Ext.isEmpty (cfg.websocket)) {
			me.ws = Ext.create ('Ext.ux.WebSocket', {
				url: me.url ,
				protocol: me.protocol ,
				communicationType: 'event'
			});
		}
		else me.ws = me.websocket;
		
		// Forces the event communication
		if (me.ws.communicationType != 'event') {
			Ext.Error.raise ('Ext.ux.WebSocket must use event communication type (set communicationType to event)!');
			return false;
		}
		
		me.ws.on (me.getApi().create, function (ws, data) {
			me.completeTask ('create', me.getApi().create, data);
		});
		
		me.ws.on (me.getApi().read, function (ws, data) {
			me.completeTask ('read', me.getApi().read, data);
		});
		
		me.ws.on (me.getApi().update, function (ws, data) {
			me.completeTask ('update', me.getApi().update, data);
		});
		
		me.ws.on (me.getApi().destroy, function (ws, data) {
			me.completeTask ('destroy', me.getApi().destroy, data);
		});
	} ,
	
	create: function (operation, callback, scope) {
		this.runTask (this.getApi().create, operation, callback, scope);
	} ,
	
	read: function (operation, callback, scope) {
		this.runTask (this.getApi().read, operation, callback, scope);
	} ,
	
	update: function (operation, callback, scope) {
		this.runTask (this.getApi().update, operation, callback, scope);
	} ,
	
	destroy: function (operation, callback, scope) {
		this.runTask (this.getApi().destroy, operation, callback, scope);
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
		if (action == me.getApi().read) me.ws.send (action);
		else {
			var data = [];
			
			for (var i=0; i<operation.records.length; i++) {
				data.push (operation.records[i].data);
			}
			
			me.ws.send (action, data);
		}
	} ,
	
	completeTask: function (action, event, data) {
		var me = this ,
			resultSet = resultSet = me.reader.read (data);
		
		// Server push case: the store is get up-to-date with the incoming data
		if (Ext.isEmpty (me.callbacks[event])) {
			var store = Ext.StoreManager.lookup (me.getStoreId ());
			
			if (typeof store === 'undefined') {
				Ext.Error.raise ('Unrecognized store: check if the storeId passed into configuration is right.');
				return false;
			}
			
			store.load (resultSet.records);
		}
		// Client request case: a callback function (operation) has to be called
		else {
			var fun = me.callbacks[event] ,
			    opt = fun.operation ,
			    records = opt.records || data;
			
			delete me.callbacks[event];
			
			opt.resultSet = resultSet;
			opt.scope = fun.scope;
			
			opt.setCompleted ();
			opt.setSuccessful ();
			
			fun.callback.apply (fun.scope, [opt]);
		}
	}
});
