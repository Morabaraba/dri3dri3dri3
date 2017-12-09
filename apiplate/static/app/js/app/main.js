/* global $ _ Backbone Slick dataView */
(function() {
	var app = window.app = window.app || {};
	app.utils = app.utils || {};
	
	
	// you know you are creating a monster with hacks like this
	app.utils.delayedOnMount = function delayedOnMount(delay) {
		setTimeout(function() {
			$.onmount();	
		}, delay);	
	};
	
	
	app.main = function main() {
		app.router = new app.class.AppRouter();
		Backbone.history.start();
		$.onmount();
	};
	

})();
