/* global $ _ Backbone Slick dataView */
(function() {
	var app = window.app = window.app || {};
	
	app.main = function main() {
		app.router = new app.class.AppRouter();
		Backbone.history.start();
		$.onmount();
	};
	

})();
