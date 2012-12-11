Ext.define ('Ext.ux.data.proxy.WebSocket', {
	extend: 'Ext.data.proxy.Proxy' ,
	alias: 'proxy.websocket' ,
	
	require: ['Ext.ux.WebSocket'] ,
	
	config: {
		api: {
			create: 'create' ,
			read: 'read' ,
			update: 'update' ,
			destroy: 'destroy'
		} ,
		callbacks: {}
	} ,
	
	constructor: function (cfg) {
		var me = this;
		
		me.initConfig (cfg);
		me.mixins.observable.constructor.call (me, cfg);
		
		if (Ext.isEmpty (cfg.websocket)) {
			me.ws = Ext.create ('Ext.ux.WebSocket', {
				url: cfg.url ,
				protocol: cfg.protocol
			});
		}
		else me.ws = cfg.websocket;
		
		// TODO: handle incoming data
		me.ws.on (me.api.create, function (ws, data) {
			me.completeTask ('create');
		});
		
		me.ws.on (me.api.read, function (ws, data) {
			var resultSet = me.reader.read (data) ,
			    fun = me.callbacks[me.api.read] ,
			    opt = Ext.create ('Ext.data.Operation', {
			    	resultSet: resultSet ,
				records: resultSet.records ,
				success: resultSet.success,
				complete: true
			    });
			
			delete me.callbacks[me.api.read];
			
			// Call the store callback
			Ext.callback (fun.callback, fun.scope, [opt]);
		});
		
		// TODO: handle incoming data
		me.ws.on (me.api.update, function (ws, data) {
			me.completeTask ('update');
		});
		
		// TODO: handle incoming data
		me.ws.on (me.api.destroy, function (ws, data) {
			me.completeTask ('destroy');
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
		
		// Callbacks store
		me.callbacks[action] = {
			operation: operation ,
			callback: callback ,
			scope: scope
		};
		
		me.ws.send (action);
	} ,
	
	completeTask: function (action) {
		var me = this ,
		    fun = me.callbacks[action];
			
		delete me.callbacks[action];
	
		fun.operation.commitRecords (fun.operation.records);
		fun.operation.setCompleted ();
		fun.operation.setSuccessful ();
	
		Ext.callback (fun.callback, fun.scope, [fun.operation]);
	}
});
