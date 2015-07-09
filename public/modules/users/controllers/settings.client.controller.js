'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$window', '$stateParams', '$http', '$location', 'Users', 'Authentication',
	function($scope, $window, $stateParams, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home.
		if (!$scope.user) $location.path('/signin');
        // If user has force change password then redirect to change password.
        if ($scope.user.forcePasswordChange===true) $location.path('/settings/password');
        
        $scope.pageSize = 10; //for the paging of users.
        $scope.sortType = 'username'; //default sort type.
        $scope.sortReverse = false; // default sort order.
        $scope.selectedRow = ''; //default to no selected row.
        //function to set the selected row id.
        $scope.setSelectedRow = function (selectedRow) {
            if ($scope.selectedRow!==selectedRow) {
                $scope.selectedRow = selectedRow;
            } else {
                $scope.selectedRow = undefined;
            }
            //console.log(selectedRow._id);
        };
        
        //get list of users.
        $scope.find = function() {
			$scope.users = Users.query();
            //console.log($scope.users);
		};
        
        //watching for profile of user being edited.
        $scope.$watchCollection('updateUser', function(newValue) {
            if (newValue!==undefined) {
                $scope.selectedRow = newValue[0];
                //console.log($scope.selectedRow);
            }
        });
        
        //get single user for editing.
        $scope.findOne = function() {
			$scope.updateUser = Users.query({
                userId: $stateParams.userId
            });
		};
        
        //create new user account - stolen from default signup method.
        $scope.createAccount = function() {
            $scope.success = $scope.error = null;
			$http.post('/auth/create', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				//$scope.authentication.user = response;
                
				// And redirect to the index page
                $scope.success = true;
				$location.path('/settings/accounts');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
        
        // Reset a users password.
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;
            var user = $scope.selectedRow;
            //console.log($scope.passwordDetails);
            
            var param = $stateParams; //access the url param - the user id.
            //console.log(param);
            
			$http.post('/settings/accounts/reset/' + param.userId, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// And redirect to the index page
				$location.path('/settings/accounts');
			}).error(function(response) {
				$scope.error = response.message;
			});
            
		};
        
        //delete a user account.
        $scope.remove = function() {
            var removeUserAccount = $scope.selectedRow;
            //console.log(user.username);
            
            var removeUser = $window.confirm('Are you sure you want to delete '+removeUserAccount.username+'?'); //confirmation of intent to delete.
            if (removeUser) {
                removeUserAccount.$remove(function() {
				$location.path('/settings/accounts');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});   
				for (var i in $scope.users) {
					if ($scope.users[i] === removeUserAccount) {
						$scope.users.splice(i, 1);
					}
				}
            }
        };
        
        
		// Update a user profile
		$scope.update = function() {
				$scope.success = $scope.error = null;
                //reset userpassword because it keeps getting overwritten.
                $scope.selectedRow.password = $scope.passwordDetails.verifyPassword;
				var updateUserAccount = new Users($scope.selectedRow);
                //console.log(updateUserAccount);
				updateUserAccount.$update(function() {
					$scope.success = true;
                    
                    $location.path('/settings/accounts');
				}, function(response) {
					$scope.error = response.data.message;
				});
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
                Authentication.user = response.user;
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
                $location.path('/pilots');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);