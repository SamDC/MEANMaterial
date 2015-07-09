'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
        //altered to allow returning of a list of users.
        return $resource('settings/accounts/:userId', {
			userId: '@_id'
        }, {
            update: {
				method: 'PUT'
			}
		});
	}
]);