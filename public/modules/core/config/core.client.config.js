'use strict';

// Core module config
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Home', 'core', 'dropdown', '/', 'home');
        Menus.addMenuItem('topbar', 'Page 1', 'core', 'dropdown', '/page1', 'arrow_forward');
	}
]);