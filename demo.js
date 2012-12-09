Ext.require (['*']);

Ext.Loader.setConfig ({
	enabled: true
});

Ext.onReady (function () {
	Ext.define ('model', {
		extend: 'Ext.data.Model' ,
		fields: ['id', 'name', 'age'] ,
		proxy: {
			type: 'websocket' ,
			url: 'ws://localhost:8888' ,
			reader: {
				type: 'json' ,
				record: 'user'
			} ,
			writer: {
				type: 'json' ,
				record: 'user'
			}
		}
	});
	
	var store = Ext.create ('Ext.data.Store', {
		model: 'model'
	});
	
	var grid = Ext.create ('Ext.grid.Panel', {
		renderTo: Ext.getBody () ,
		title: 'WebSocketed Grid' ,
		width: 300 ,
		height: 300 ,
		store: store ,
		
		columns: [{
			text: 'ID' ,
			dataIndex: 'id'
		} , {
			text: 'Name' ,
			dataIndex: 'name' ,
			flex: 1
		} , {
			text: 'Age' ,
			dataIndex: 'age'
		}] ,
		
		tbar: {
			xtype: 'toolbar'
		}
	});
	
	Ext.create ('Ext.button.Button', {
		text: 'Load' ,
		renderTo: Ext.getBody () ,
		handler: function () {
			store.load ();
		}
	});
});
