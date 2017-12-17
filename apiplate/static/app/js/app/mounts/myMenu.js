/* global $ _ Backbone Slick */
(function() {
	var app = window.app = window.app || {};
	app.mounts = app.mounts || {};


	function buildMenu(menuModel, key) {
		//debugger;
		var menuItem = menuModel[key];

		var id = menuItem.id;
		var shortcut = menuItem.shortcut;
		var icon_css = menuItem.icon_css;
		var class_ = menuItem.class;
		if (icon_css) {
			var $icon = $('<div>');
			_.each(icon_css.split(' '), function(cls) {
				$icon.addClass(cls);
			})
		}
		
		var menuTitle = key;
		if (shortcut) {
			menuTitle = menuTitle.split(shortcut);
			if (_.isArray(menuTitle)) {
				menuTitle = menuTitle[0] + '<u>' + shortcut + '</u>' + menuTitle[1];
			};
		}
		
		var $menuItem;
		if (menuItem.children) {
			$menuItem = $('<li class="dropdown">');
			$menuTitle = $('<a class="dropdown-toggle" href="#" data-toggle="dropdown"></a>');
			if (class_) {
				_.each( class_.split(' '), function(c) { $menuTitle.addClass(c); });
			}
			if (icon_css) {
				$menuTitle.append($icon);	
			}			
			$menuTitle.html( $menuTitle.html() + '&nbsp;' + menuTitle);
			$menuItem.append($menuTitle);
			
			var $dropdownMenu = $('<ul class="dropdown-menu">');
			$menuItem.append($dropdownMenu);
			
			_.each(_.keys(menuItem.children), function(childKey) {
				var child = menuItem.children[childKey];
				var $child;
				if (child.divider) {
					$child = $('<li class="divider"></li>');

				} else {
					$child = buildMenu(menuItem.children, childKey);

				};
				$dropdownMenu.append($child);
			});
			
		} else {
			$menuItem = $('<li>');
			var $menuTitle = $('<a href="#"></a>');
			if (icon_css) {
				$menuTitle.append($icon);	
			}			
			$menuTitle.html( $menuTitle.html() + '&nbsp;' + menuTitle);
			$menuItem.append($menuTitle);
		}
		return $menuItem;
	}


	app.mounts.myMenu = function mounMyMenu(id, urlRoot) {
		var menu = { 
			id: id || 'myMenu',
			urlRoot: urlRoot || 'js/app/models/menu.json',
			ready: false 
			
		};
		$.onmount('#' + menu.id, function() {
			var $self = $(this);
			var Menu = Backbone.Model.extend({
				urlRoot: menu.urlRoot
			});
			var menuModel = new Menu();
			menuModel.once('error', function() {
				alert('fetch error, see console.');
				console.error(arguments);
			});
			menuModel.once('sync', function(event, model, response, options) {
				//debugger;
				_.each(_.keys(model), function(key) {
					var $menu = buildMenu(model, key);
					$self.append($menu);
				});
				menu.$el = $self;
				menu.ready = true;
			})
			menuModel.fetch();
			
			menu.model = menuModel;
			$self.data('menu', menu);
		});
		return menu;
	}
})();