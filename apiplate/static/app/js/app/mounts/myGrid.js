/* global $ _ Backbone Slick Hashids */
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
			var dataCollection = new Backbone.Collection();
			dataCollection.url = '//s3-us-west-2.amazonaws.com/s.cdpn.io/152047/data.js';
			dataCollection.dataView = dataView;
			
			dataCollection.on("add", function (model, collection, options) {
				console.log('add', arguments);
			});

			dataCollection.on("remove", function (model, collection, options) {
				console.log('remove', arguments);
			});

			dataCollection.on("update", function (collection, options) {
				console.log('update', arguments);
			});

			dataCollection.on("reset", function (collection, options) {
				console.log('reset', arguments);
			});
			
			dataCollection.on("sort", function (collection, options) {
				console.log('sort', arguments);
			});

			dataCollection.on("sync", function (collection, options) {
				console.log('sync', arguments);
				collection.dataView.setItems(collection.models);	
				grid.ready = true;
			});
			
			dataCollection.on("error", function (collection, options) {
				console.log('error', arguments);
				
				var hashids = new Hashids("this is my salt");
				var id = hashids.encode(1, 2, 3);
  //numbers = hashids.decode(id);
  
  
				app.utils.$modal(app.utils.$alert('error ' + id, id, hashids, '[test]'), { label: 'err' }).appendTo(document.body).modal({ show: true })
			});
			
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
			
			dataCollection.fetch();
			
			//var grid2 = new Slick.Grid("#myGrid2", data, columns, options);
			//grid2.setSelectionModel(new Slick.CellSelectionModel());

			//grid2.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));

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