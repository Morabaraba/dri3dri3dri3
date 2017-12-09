/* global $ _ Backbone Slick dataView */
(function() {
	var app = window.app = window.app || {};
	app.class = app.class || {}
	var AppRouter = app.class.AppRouter = Backbone.Router.extend({

		routes: {
			"": "index", // #help
			"help": "help", // #help
			"search/:query": "search", // #search/kiwis
			"search/:query/p:page": "search" // #search/kiwis/p7
		},

		index: function() {
			console.log('Routing to "app.routes.index"');
			app.routes.index();
			console.log('Routed to "app.routes.index"');
		},
		help: function() {

		},

		search: function(query, page) {

		}

	});

})();