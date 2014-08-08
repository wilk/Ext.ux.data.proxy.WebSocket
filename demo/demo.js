Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux.WebSocket': '../bower_components/ext.ux.websocket/WebSocket.js',
        'Ext.ux.data.proxy.WebSocket': '../WebSocket.js'
    }
});

Ext.require(['Ext.ux.data.proxy.WebSocket']);

Ext.onReady(function () {
    Ext.define('model', {
        extend: 'Ext.data.Model',
        fields: ['id', 'name', 'age'],
        proxy: {
            type: 'websocket',
            storeId: 'myStore',
            url: 'ws://localhost:9001',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json',
                writeAllFields: true
            }
        }
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'model',
        storeId: 'myStore'
    });

    var grid = Ext.create('Ext.grid.Panel', {
        renderTo: Ext.getBody(),
        title: 'WebSocketed Grid',
        width: 500,
        height: 300,
        store: store,

        selType: 'rowmodel',
        selModel: 'rowmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })],

        columns: [
            /*{
            // rownumberer doesn't work in 5.0.0:
            // EXTJS-13759 Rownumberer/Action Column causes error when updating row.
            // Fixed in Ext JS 5.0.1.
            xtype: 'rownumberer'
        } , */
            {
            text: 'ID',
            dataIndex: 'id',
            hidden: true
        } , {
            text: 'Name',
            dataIndex: 'name',
            flex: 1,
            editor: {
                xtype: 'textfield'
            }
        } ,{
            text: 'Age',
            dataIndex: 'age',
            editor: {
                xtype: 'numberfield'
            }
        }],

        tbar: {
            xtype: 'toolbar',
            defaultType: 'button',
            items: [{
                text: 'Create',
                icon: 'images/plus-circle.png',
                handler: function (btn) {
                    store.insert(0, {});
                }
            } , '-' , {
                text: 'Read',
                icon: 'images/arrow-circle.png',
                handler: function (btn) {
                    store.load();
                }
            } , '-' , {
                text: 'Update',
                icon: 'images/disk--pencil.png',
                handler: function (btn) {
                    store.sync({
                        success: function () {
                            store.load();
                        }
                    });
                }
            } , '-' , {
                text: 'Destroy',
                icon: 'images/cross-circle.png',
                handler: function (btn) {
                    store.remove(grid.getSelectionModel().getSelection());
                }
            }]
        }
    });

    var chart = Ext.create('Ext.chart.Chart', {
        renderTo: Ext.getBody(),
        title: 'WebSocketed Chart',
        width: 500,
        height: 300,
        store: store,

        axes: [{
            type: 'Category',
            position: 'bottom',
            fields: ['name']
        } , {
            type: 'Numeric',
            position: 'left',
            minimum: 0,
            fields: ['age']
        }],

        series: [{
            type: 'column',
            axis: 'left',
            xField: 'name',
            yField: 'age'
        }]
    });

    Ext.define('TreeModel', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'text',
            mapping: 'name',
            type: 'string'
        } , {
            name: 'leaf',
            type: 'boolean'
        }]
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        storeId: 'myTreeStore',
        autoLoad: false,
        model: 'TreeModel',
        proxy: {
            type: 'websocket',
            url: 'ws://localhost:9001',
            storeId: 'myTreeStore',
            api: {
                create: 'user/create',
                read: 'user/read',
                update: 'user/update',
                destroy: 'user/destroy'
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        },
        root: {
            expanded: true
        }
    });

    var tree = Ext.create('Ext.tree.Panel', {
        renderTo: Ext.getBody(),
        title: 'WebSocketed Tree Panel',
        width: 500,
        height: 300,
        store: treeStore
    });
});
