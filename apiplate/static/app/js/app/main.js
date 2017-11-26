/* global $ _ Slick dataView */
(function(){
var app = window.app = app || {};
app.mount = app.mount || {};

app.main = function main() {
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
	app.mount.myGrid(data, columns, options, pluginOptions);
	$.onmount();
};

app.mount.myGrid = function mountMyGrid(data, columns, options, pluginOptions) {
	var grid = { myGridReady: false };
	$.onmount('#myGrid', function() {
		var $self = $(this);
		for (var i = 0; i < 100; i++) {
			var d = (data[i] = {});
			d["id"] = i;
			d["num"] = i;
			for (var j = 0; j < 26; j++) {
				d[j] = j + i;
			}
			d["percentComplete"] = Math.round(Math.random() * 100);
			d["start"] = new Date(Math.round(Math.random() * 1000000000));
			d["weekCalendar"] = [true, true, true, true, true, true, true, true, true, true, false, false, false, false];
		}
	
		dataView = new Slick.Data.DataView();
		dataView.setItems(data);
		grid = _.extend(grid, new Slick.Grid("#myGrid", dataView, columns, options));
		grid.setSelectionModel(new Slick.CellSelectionModel());
		grid.registerPlugin(new Slick.AutoTooltips());
	
		// set keyboard focus on the grid
		grid.getCanvasNode().focus();
	
		grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
	
		grid.onCellChange.subscribe(function(e, args) {
			dataView.updateItem(args.item.id, args.item);
		});
	
		grid.onAddNewRow.subscribe(function(e, args) {
			var item = args.item;
			var column = args.column;
			grid.invalidateRow(data.length);
			data.push(item);
			grid.updateRowCount();
			grid.render();
		});
		
		$self.data('grid', grid);
		grid.myGridReady = true;
		
		var grid2 = new Slick.Grid("#myGrid2", data, columns, options);
		grid2.setSelectionModel(new Slick.CellSelectionModel());
	
		grid2.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
	
	});

	$.onmount('.slick-header .slick-header-column:first-child', function() {
		var $self = $(this);
		function filterClick(){
			alert('filter');
			return false; // do not bubble event
		}
		$self.children(':first-child').click(filterClick).html('&#x1f50d;');
		$self.click(filterClick)
	});
	return grid;
}
})();
