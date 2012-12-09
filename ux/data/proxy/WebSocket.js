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
		
		me.ws.on (me.api.create, function (ws, data) {
//			me.callbacks[action] (data);
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
			
			// TODO: keep it?
			me.fireEvent ('metachange', resultSet.records);
			
			// Call the store callback
			Ext.callback (fun.callback, fun.scope, [opt]);
		});
		
		me.ws.on (me.api.update, function (ws, data) {
			var resultSet = me.reader.read (data) ,
			    fun = me.callbacks[me.api.read] ,
			    opt = Ext.create ('Ext.data.Operation', {
			    	resultSet: resultSet ,
				records: resultSet.records ,
				success: resultSet.success,
				complete: true
			    });
			
			delete me.callbacks[me.api.read];
			
			// TODO: keep it?
			me.fireEvent ('metachange', resultSet.records);
			
			Ext.callback (fun.callback, fun.scope, [opt]);
		});
		
		me.ws.on (me.api.destroy, function (ws, data) {
		});
	} ,
	
	create: function (operation, callback, scope) {
		this.runAction (this.api.create, operation, callback, scope);
	} ,
	
	read: function (operation, callback, scope) {
		this.runAction (this.api.read, operation, callback, scope);
	} ,
	
	update: function (operation, callback, scope) {
		this.runAction (this.api.update, operation, callback, scope);
	} ,
	
	destroy: function (operation, callback, scope) {
		this.runAction (this.api.destroy, operation, callback, scope);
	} ,
	
	runAction: function (action, operation, callback, scope) {
		var me = this;
		
		// Callbacks store
		me.callbacks[action] = {
			callback: callback ,
			scope: scope
		};
		
		me.ws.send (action);
	}
});
