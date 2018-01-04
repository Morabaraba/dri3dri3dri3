/* global $ _ Backbone Slick dataView */
(function() {
    var app = window.app = window.app || {};
    app.routes = app.routes || {};

    app.routes.index = function index() {
        var grid;
        var grid2;
        var data = [];
        var data2 = [];

        function getVal(item, columnDef) {
            //return dataView.getItemById(item.id)[columnDef.field];
            return item[columnDef.field];
        }

        function setVal(item, columnDef, value) {
            item[columnDef.field] = value;
            //    dataView.updateItem(item.id, item);
        }

        var options = {
            editable: true,
            enableAddRow: true,
            enableCellNavigation: true,
            asyncEditorLoading: false,
            autoEdit: false,
            dataItemColumnValueExtractor: getVal,
            dataItemColumnValueSetter: setVal
        };

        var undoRedoBuffer = {
            commandQueue: [],
            commandCtr: 0,

            queueAndExecuteCommand: function(editCommand) {
                this.commandQueue[this.commandCtr] = editCommand;
                this.commandCtr++;
                editCommand.execute();
            },

            undo: function() {
                if (this.commandCtr == 0) { return; }

                this.commandCtr--;
                var command = this.commandQueue[this.commandCtr];

                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.undo();
                }
            },
            redo: function() {
                if (this.commandCtr >= this.commandQueue.length) { return; }
                var command = this.commandQueue[this.commandCtr];
                this.commandCtr++;
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.execute();
                }
            }
        }
        app.undoRedoBuffer = undoRedoBuffer;

        // undo shortcut
        $(document).keydown(function(e) {
            if (e.which == 90 && (e.ctrlKey || e.metaKey)) { // CTRL + (shift) + Z
                if (e.shiftKey) {
                    undoRedoBuffer.redo();
                }
                else {
                    undoRedoBuffer.undo();
                }
            }
        });

        var newRowIds = 0;

        var pluginOptions = {
            clipboardCommandHandler: function(editCommand) { undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer, editCommand); },
            readOnlyMode: false,
            includeHeaderWhenCopying: false,
            newRowCreator: function(count) {
                for (var i = 0; i < count; i++) {
                    var item = {
                        id: "newRow_" + newRowIds++
                    }
                    grid.getData().addItem(item);
                }
            }
        };

        var columns = [{
            id: "selector",
            name: "",
            field: "num",
            width: 30
        }];

        for (var i = 0; i < 26; i++) {
            columns.push({
                id: i,
                name: String.fromCharCode("A".charCodeAt(0) + i),
                field: i,
                width: 60 //,
                //editor: Slick.Editors.Text
            });
        }

        columns[4] = { id: "%", name: "% Complete", field: "percentComplete", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete };
        columns[5] = { id: "start", name: "Start", field: "start", minWidth: 60, editor: Slick.Editors.Date };
        grid = app.mounts.myGrid(data, columns, options, pluginOptions);
        
        var layout = app.mounts.myLayout();
        var menu = app.mounts.myMenu();
        var menubar = app.mounts.myMenuBar();
        
        var sigbladMenu = app.mounts.myMenu('js-sigblad-menu', 'js/app/models/sigblad.json');
        
        app.state.connection = app.wamp.connect();
        
    };
    
    
})();