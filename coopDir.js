(function() {
	'use strict';

	angular.module('directives').directive('detailsTable', detailsTable);
	detailsTable.$inject = ['helperService'];
	function detailsTable(helperService) {
		var directive = {
			restrict : 'EA',
			replace : true,
			scope : {
				item : '='
			},
			templateUrl : 'include/scenario/directives/coop.html',
			controller : function($scope) {
//				debugger;
				$scope.newRetailType = 0;
				$scope.effectiveDate = new Date();
				
				$scope.resetField = function(){
					$scope.effectiveDate = '';
				}
				
				$scope.validateDate=function(){
					debugger;
					var curDate = new Date().getTime(), selectedDate;
					if($scope.effectiveDate){
						selectedDate  = new Date($scope.effectiveDate).getTime();
					}
					
					if(selectedDate > curDate){						
						helperService.showDialog('Date should be less than or equal to today\'s date');
						$scope.resetField();
					}
				}
				
				$scope.applyCoop = function(id) {
				debugger;
					$('#'+id).css({'border':'1px solid #009900'});

				}
				$scope.cancelCoop= function(id){
					debugger;
					$('#'+id).css({'border':'1px solid #990000'});
					$scope.$parent.toggleDetailsView(id.split('_')[1], true);
				}
				
			}
		};

		return directive;

	}

})();
