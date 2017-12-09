/* global $ _ Backbone Slick */
(function() {
	var app = window.app = window.app || {};
	app.mounts = app.mounts || {};

	app.mounts.myGrid = function mountMyGrid(data, columns, options, pluginOptions) {
		var grid = { ready: false };
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

			var dataView = new Slick.Data.DataView();
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
			grid.ready = true;

			var grid2 = new Slick.Grid("#myGrid2", data, columns, options);
			grid2.setSelectionModel(new Slick.CellSelectionModel());

			grid2.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));

		});

		$.onmount('.slick-header .slick-header-column:first-child', function() {
			var $self = $(this);

			function filterClick() {
				alert('filter');
				return false; // do not bubble event
			};
			
			$self.children(':first-child').click(filterClick).html('&#x1f50d;');
			
			$self.click(filterClick);
		});
		return grid;
	}
})();