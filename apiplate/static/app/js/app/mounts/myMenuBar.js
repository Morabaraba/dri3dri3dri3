/* global $ _ Backbone Slick */
(function() {
	var app = window.app = window.app || {};
	app.mounts = app.mounts || {};

	function buildMenuBar(menuModel, key) {
		//debugger;
		var menuItem = menuModel[key];

		var id = menuItem.id;
		var shortcut = menuItem.shortcut;
		var icon_css = menuItem.icon_css;
		if (icon_css) {
			var $icon = $('<div>');
			_.each(icon_css.split(' '), function(cls) {
				$icon.addClass(cls);
			})
		}
		
		var menuTitle = key;
		menuTitle = menuTitle.split(shortcut);
		if (_.isArray(menuTitle)) {
			menuTitle = menuTitle[0] + '<u>' + shortcut + '</u>' + menuTitle[1];
		};

		var $menuItem;
		if (menuItem.children) {
			var $btnGroup = $('<div class="btn-group">');
			
			_.each(_.keys(menuItem.children), function(childKey) {
				var child = menuItem.children[childKey];
				var $child;
				if (child.divider) {
					$child = $('<div class="menubar-divider"> </div>');
				} else {
					$child = buildMenuBar(menuItem.children, childKey);

				};
				$btnGroup.append($child);
			});
			$menuItem = $btnGroup;
		} else {
			
			var $btn = $('<button class="btn"></button>');
			if (icon_css) {
				$btn.append($icon);	
			}			
			$menuItem = $btn;
		}
		return $menuItem;
	}
	
	app.mounts.myMenuBar = function mounMyMenuBar() {
		var menu = { ready: false };
		$.onmount('#myMenuBar', function() {
			var $self = $(this);
			var Menu = Backbone.Model.extend({
				urlRoot: 'js/app/models/menubar.json'
			});
			var menuModel = new Menu();
			menu.model = menuModel;
			menuModel.once('error', function() {
				alert('fetch error, see console.');
				console.error(arguments);
			});
			menuModel.once('sync', function(event, model, response, options) {
				//debugger;
				_.each(_.keys(model), function(key) {
					var $menu = buildMenuBar(model, key);
					$self.append($menu);
				});
				menu.$el = $self;
				menu.ready = true;
			})
			menuModel.fetch();
		});
		return menu;
	}
})();