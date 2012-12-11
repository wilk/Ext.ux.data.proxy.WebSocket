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
		
		selType: 'cellmodel' ,
		plugins: [Ext.create ('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		})] ,
		
		columns: [{
			text: 'ID' ,
			dataIndex: 'id' ,
			editor: {
				xtype: 'textfield'
			}
		} , {
			text: 'Name' ,
			dataIndex: 'name' ,
			flex: 1 ,
			editor: {
				xtype: 'textfield'
			}
		} , {
			text: 'Age' ,
			dataIndex: 'age' ,
			editor: {
				xtype: 'numberfield'
			}
		}] ,
		
		tbar: {
			xtype: 'toolbar' ,
			defaultType: 'button' ,
			items: [{
				text: 'Create' ,
				icon: 'images/plus-circle.png' ,
				handler: function (btn) {
					store.insert (0,{});
				}
			} , '-' , {
				text: 'Read' ,
				icon: 'images/arrow-circle.png' ,
				handler: function (btn) {
					store.load ();
				}
			} , '-' , {
				text: 'Update' ,
				icon: 'images/disk--pencil.png' ,
				handler: function (btn) {
					store.sync ();
				}
			} , '-' , {
				text: 'Destroy' ,
				icon: 'images/cross-circle.png' ,
				handler: function (btn) {
					store.remove (grid.getSelectionModel().getSelection ());
				}
			}]
		}
	});
});
