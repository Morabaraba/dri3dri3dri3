/* global $ jQuery GoldenLayout Slick StockDataProvider */
(function() {
	var app = window.app = window.app || {};
	app.mounts = app.mounts || {};


	app.mounts.myLayout = function mountMyLayout() {
		var layout = { ready: false };
		$.onmount('#myLayout', function init() {
			layout.manager = createMyLayout();
			layout.manager.on('initialised', function() {
				layout.ready = true;
				console.log('initialised myLayout ready')
			});
		}, function exit() {

		});
		return layout;
	};

	var exampleStockConfig = {
		content: [{
			type: 'stack',
			content: [{
				type: 'component',
				title: 'Example',
				componentName: 'example',

			}, {
				type: 'component',
				componentName: 'stockGrid',
				title: 'FTSE 100 (51-100)',
				componentState: {
					symbols: [
						"KGF", "LAND", "LGEN", "LLOY", "LSE", "MKS",
						"MGGT", "MNDI", "MRW", "NG", "NXT", "OML", "PSON",
						"PSN", "PFC", "PRU", "RRS", "RB", "REL", "REX",
						"RIO", "RR", "RBS", "RDSA", "RDSB", "RMG", "RSA",
						"SAB", "SGE", "SBRY", "SDR", "SVT", "SHP", "SN",
						"SMIN", "SPD", "SSE", "STJ", "STAN", "SL", "TSCO",
						"TPK", "TT", "TLW", "ULVR", "UU", "VOD", "WEIR", "WTB", "WOS"
					]
				}
			}, {
				type: 'component',
				componentName: 'stockGrid',
				title: 'FTSE 200 (51-100)',
				componentState: {
					symbols: [
						"KGF", "LAND", "LGEN", "LLOY", "LSE", "MKS",
						"MGGT", "MNDI", "MRW", "NG", "NXT", "OML", "PSON",
						"PSN", "PFC", "PRU", "RRS", "RB", "REL", "REX",
						"RIO", "RR", "RBS", "RDSA", "RDSB", "RMG", "RSA",
						"SAB", "SGE", "SBRY", "SDR", "SVT", "SHP", "SN",
						"SMIN", "SPD", "SSE", "STJ", "STAN", "SL", "TSCO",
						"TPK", "TT", "TLW", "ULVR", "UU", "VOD", "WEIR", "WTB", "WOS"
					]
				}
			}]
		}]
	}


	function createMyLayout() {
		var $myLayout = $('#myLayout');
		
		
		function resizeLayout() {
			
			var mPos = $myLayout.position();
			var wHeight = $(window).height();
			
			$myLayout.height(wHeight - mPos.top - 22); // 6 some space trickery
			
			
		}
		resizeLayout();
		$(window).resize(resizeLayout);
		
		
		var myLayout = new GoldenLayout(exampleStockConfig, '#myLayout');
		
		
		myLayout.registerComponent('stockGrid', StockGridComponent);


		myLayout.registerComponent('example', function(container, state) {
			var $el = container.getElement();

			var $grid1 = $('<div id="myGrid"></div>');
			var $grid2 = $('<div id="myGrid2"></div>');

			$el.append($grid1);
			$el.append($grid2);

			function resizeGrids() {
				//var elHeightDiv2 = $el.height() / 2;
                $grid1.css('height',  $el.height());
				//$grid1.css('height', elHeightDiv2);
				//$grid2.css('height', elHeightDiv2);
				
			}
			container.on('resize',
				resizeGrids
			);
			/*container.on('open',
				resizeGrids
			);*/
			app.utils.delayedOnMount(); // after appending the divs call $.onmount() to create our two grid components
		});


		myLayout.init();

		return myLayout;
	};


	var StockGridComponent = function(container, state) {
		this._container = container;
		this._state = state;
		this._grid = null;
		this._stockDataProvider = new StockDataProvider();
		this._columns = [
			{ id: "symbol", name: "Symbol", field: "symbol" },
			{ id: "company", name: "Company", field: "company" },
			{ id: "price", name: "Price", field: "price" },
			{ id: "change", name: "Change", field: "change" },
			{ id: "changeRel", name: "Change %", field: "changeRel" },
			{ id: "volume", name: "Volume", field: "volume" }
		];
		this._options = {
			editable: false,
			enableAddRow: false,
			enableCellNavigation: true
		};

		container.on('open', this._scheduleGridCreation, this);
	};


	/**
	 * This method is used to get around a chrome-bug that manifests itself when using popout windows with Slickgrid
	 * in Codepens.
	 *
	 * SlickGrid appends a custom style element to the head section and checks for its presence using the document.styleSheets property.
	 * This seems to cause a number of issues (https://github.com/mleibman/SlickGrid/issues/223). 
	 * 
	 * The specific problem here is, that when opening a new popout window, GoldenLayout moves all link elements from
	 * the body to the head section (links are in the body in Codepens). Chrome only updates its document.styleSheets array once
	 * these stylesheets have been loaded - which is correct.
	 *
	 * What isn't correct is, that Chrome defers adding the styletag - which doesn't need loading - to the document.styleSheets array until
	 * all dynamically added link elements are loaded.
	 *
	 * To recap: this will happen if all of these conditions are true
	 *
	 * - Have link elements in body instead of head
	 * - Use SlickGrid - I've never seen anything else access the document.styleSheets array
	 * - Open Popout window - only then does GoldenLayout move link tags around
	 *
	 * The work-around is to defer SlickGrid's initialisation until all stylesheets have been loaded - which can be checked
	 * by attaching event listeners  to the link tag's "load event" or - to make sure that we don't miss a stylesheet that has
	 * already been loaded - poll the link elements sheet property
	 */
	StockGridComponent.prototype._scheduleGridCreation = function() {
		var interval = setInterval(function() {
			var stylesheetNodes = $('link[rel=stylesheet]'),
				i;

			for (i = 0; i < stylesheetNodes.length; i++) {
				if (stylesheetNodes[i].sheet === null) {
					return;
				}
			}

			clearInterval(interval);
			this._createGrid();

		}.bind(this), 10);
	};


	StockGridComponent.prototype._createGrid = function() {
		this._grid = new Slick.Grid(
			this._container.getElement(),
			this._stockDataProvider.getStocksBySymbol(this._state.symbols),
			this._columns,
			this._options
		);

		this._container.on('resize', this._resize, this);
		this._container.on('destroy', this._destroy, this);
		this._resize();
	};


	StockGridComponent.prototype._resize = function() {
		this._grid.resizeCanvas();
		this._grid.autosizeColumns();
	};


	StockGridComponent.prototype._destroy = function() {
		this._grid.destroy();
	};
})();