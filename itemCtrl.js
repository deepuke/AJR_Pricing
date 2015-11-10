angular.module("controllers").
controller('itemDetailsCtrl',
		[ '$scope', 'CONFIG', 'RESTService', '$filter', '$rootScope', 'helperService', itemDetailsCtrl]);

function itemDetailsCtrl($scope, CONFIG, RESTService, $filter, $rootScope, helperService) {

	$scope.itemDetails = [];// {"itemNumber":"4673384","mdsFamId":"78522947","linkType":"NA","itemUPC":"1851517943","deptNumber":"46","inventory":"94.0","retailType":"NA","itemUOM":"Each","itemSize":"1.0EA","itemColor":null,"itemCost":"3.7","itemRetail":"5.98","deptDescription":"BEAUTY","itemDescription":"SOLAR
	// SENSE VALUE
	// PK","itemPrimeFlag":"NA","itemStoreId":"ALL","expirationDate":"09/26/2015"}];
	$scope.itemDetailsFilter=[];
	$scope.itemDetailsItemNoFilter=[];
	$scope.itemDetailsItemDescFilter=[];
	$scope.itemDetailsItemUpcFilter=[];
	$scope.itemDetailsItemStoreFilter=[];
	$scope.itemDetailsItemLiTyFilter=[];
	$scope.itemDetailsItemUomFilter=[];
	$scope.itemDetailsItemColorFilter=[];

	$rootScope.rulesCalLoading = false;
	
	$scope.calculate = function() {
//		debugger;
//		$scope.$parent.showRules();
		$rootScope.displayLoading = true;
		$rootScope.rulesLoading = false;
		$rootScope.rulesCalLoading = true;
		if ($scope.itemDetails.length == 0){
			$rootScope.displayLoading = false;
			$rootScope.message = 'Item grid is empty.';
			$('#messageBox').modal('show');
			return;
		}
			else if ($scope.$parent.itemSelectedLength == 0){
			$rootScope.displayLoading = false;
			$rootScope.message = 'Items not selected in the grid.';
			$('#messageBox').modal('show');
			return;
		}
		
		selectedItemsRequestData = $filter('filter')($scope.itemDetails, {'selected' : true});

		for(var i = 0; i < selectedItemsRequestData.length; i++){
			if(selectedItemsRequestData[i].newRetail == 0 ||
			selectedItemsRequestData[i].newRetail == undefined ||
			selectedItemsRequestData[i].newRetail == ''){
			$rootScope.displayLoading = false;
			$rootScope.message = 'New Retail is empty or invalid';
			$('#messageBox').modal('show');
			return;
			}
			}
		
		RESTService.getRulesData(selectedItemsRequestData).then(function(results) {
			try {
				results = angular.fromJson(results);
				$rootScope.$broadcast('rulesDataUpdated',results);
			} catch (e) {
//				$scope.dataLoadError();
				return;
			}
			$rootScope.displayLoading = false;

		});
		$rootScope.$broadcast('calculate');
	};

	$scope.$on('loadScenario', function(event, data) {
		req=[];
		for(var i = 0; i < data.length; i++){
			data[i].effectiveDate = new Date(data[i].effectiveDate);
			data[i].expirationDate = new Date(data[i].expirationDate);
		}
		$scope.itemDetails = data;
		$scope.$parent.items = data;
		$rootScope.$broadcast('ItemsCheck',$scope.itemDetails);
		//$scope.$parent.itemSelectedLength = 0;
//		debugger;
		
		//refresh
		for(var j = 0; j < data.length; j++){
			req.push({'itemNumber': data[j].itemNumber,'storeId': data[j].itemStoreId});

			RESTService.refreshItemDetails(req).then(function (results) {
				try {
					//results=[{"itemNumber":"553459555","mdsFamId":"78522947","linkType":"NA","itemUPC":"1851517943","deptNumber":"46","inventory":"99.0","retailType":"NA","itemUOM":"Each","itemSize":"1.0EA","itemColor":null,"itemCost":"3.7","itemRetail":"5.98","deptDescription":"BEAUTY","itemDescription":"SOLAR"}];
					var response = {};
					for (var k = 0; k < results.length; k++) {
						response[results[k].itemNumber] = results[k]; 
					}
					
					for (var j = 0; j < $scope.itemDetails.length; j++) {
						
							var itemNumber = data[j].itemNumber;
							
							if(itemNumber in response){
								$scope.itemDetails[j].itemStoreId = response[itemNumber].itemStoreId;
								$scope.itemDetails[j].itemRetail = response[itemNumber].itemRetail;
								$scope.itemDetails[j].inventory = response[itemNumber].inventory;
								$scope.itemDetails[j].itemCost = response[itemNumber].itemCost;
								$scope.itemDetails[j].sales = response[itemNumber].sales;
							}
					}
				} catch (e) {
//					$scope.dataLoadError();
					return;
				}
			});
		}
	});
	
	

	$scope.activate = function() {
//		$scope.$parent.showLoading(1);
		$rootScope.displayLoading = true;
		if ($scope.itemDetails.length == 0){
//			$scope.$parent.hideLoading();
			$rootScope.displayLoading = false;
			$rootScope.message = 'Item grid is empty.';
			$('#messageBox').modal('show');
			return;
		}
		else if ($scope.$parent.itemSelectedLength == 0){
//			$scope.$parent.hideLoading();
			$rootScope.displayLoading = false;
			$rootScope.message = 'Items not selected in the grid.';
			$('#messageBox').modal('show');
			return;
		}
		var dataTemplate = {
				"cntry_cd" : "US",
				"div_nbr" : "1",
				"store_nbr" : "All",
				"store_rtl" : "",
				"store_rtl_type" : "",
				"process_flag" : "pending",
				"comment_cd" : "",
				"creator_id" : "",
				"create_ts" : "",
				"last_chg_user_id" : "",
				"last_chg_ts" : ""
		}

		var requestData = [];

		for (var i = 0; i < $scope.itemDetails.length; i++)
		{
		  if($scope.itemDetails[i].selected==true)
			  //Outer If Condition added for Defect # 224 START
		  {
			if ($scope.itemDetails[i].effectiveDate == undefined
					|| $scope.itemDetails[i].expirationDate == undefined
					|| $scope.itemDetails[i].newRetail == undefined
					|| $scope.itemDetails[i].newRetail == ''
						|| $scope.itemDetails[i].newRetail == 0
						|| $scope.itemDetails[i].newRetailType == undefined
						|| $scope.itemDetails[i].newRetailType == '') {
				//|| data.unit_cost == undefined) {
//				$scope.$parent.hideLoading();
				$rootScope.displayLoading = false;
				$rootScope.message = '* Fields are empty or invalid ';
//				$rootScope.message = '* Fields are empty for the Item ID : '
//					+ $scope.itemDetails[i].itemNumber;
				$('#messageBox').modal('show');
				return;
			}
		   }//Outer If Condition added for Defect # 224 END
			var data = {};
			angular.copy(dataTemplate, data);
//			debugger;
			if ($scope.itemDetails[i].selected) {
				data.effective_dt = $scope.itemDetails[i].effectiveDate;
				data.expiration_dt = $scope.itemDetails[i].expirationDate;
				data.item_nbr = $scope.itemDetails[i].itemNumber;
				data.ho_rcmd_rtl = $scope.itemDetails[i].newRetail;
				data.ho_rcmd_rtl_type = $scope.itemDetails[i].newRetailType;
				data.unit_cost = 0;//$scope.itemDetails[i].newCost;
				data.store_nbr = $scope.itemDetails[i].itemStoreId;

				requestData.push(data);
			}
		}
		if (requestData.length != 0) {
			RESTService.activate(requestData).then(function(msg) {
//				$scope.$parent.hideLoading();
				$rootScope.displayLoading = false;
				$rootScope.message = 'Successfully Submitted Price Changes';
				$('#messageBox').modal('show');
			})
		}
	};

	$scope.checkForOverlappingDates = function(item, index, whichDate){

		var curDate = new Date();
		curDate = new Date((curDate.getMonth() + 1) + '-' + curDate.getDate() + '-' + curDate.getFullYear());
		
		if(item.effectiveDate != undefined){
		if(item.effectiveDate < curDate){
		$rootScope.message = 'Effective date should be greater than or equal to current date';
		$('#messageBox').modal('show');
		item.effectiveDate = undefined;
		return;
		}
		}
		
		if(item.expirationDate != undefined){
		if(item.expirationDate < curDate){
		$rootScope.message = 'Expiry date should be greater than or equal to current date';
		$('#messageBox').modal('show');
		item.expirationDate = undefined;
		return;
		}
		}
		
		if(item.effectiveDate != undefined && item.expirationDate != undefined && item.effectiveDate >= item.expirationDate){
			$rootScope.message = 'Expire Date should be greater than Effective Date';
			$('#messageBox').modal('show');
			if(whichDate == 'effectiveDate') item.effectiveDate = undefined;
			else if(whichDate == 'expireDate') item.expirationDate = undefined;
			else if(whichDate == 'all'){
				item.effectiveDate = undefined;
				item.expirationDate = undefined;
			}
			return;
		}

		$scope.itemDetailsCopy = angular.copy($scope.itemDetails);
		if(index != -1)	$scope.itemDetailsCopy.splice(index, 1);

		var duplicates = $filter('filter')($scope.itemDetailsCopy, {'itemNumber' : item.itemNumber, 'itemStoreId' : item.itemStoreId});
//		orderedDuplicates = $filter('orderBy')(duplicates, 'effectiveDate');

		var overlap = false;
		for(var i = 0; i < duplicates.length; i++){
			if(item.effectiveDate >= duplicates[i].effectiveDate && item.effectiveDate <= duplicates[i].expirationDate ||
					item.expirationDate >= duplicates[i].effectiveDate && item.expirationDate <= duplicates[i].expirationDate ||
					item.effectiveDate <= duplicates[i].effectiveDate && item.expirationDate >= duplicates[i].expirationDate) {
				overlap = true;
				break;
			}
		}
		if(overlap){
			$rootScope.message = 'Time Frame is overlapping for Item#' + item.itemNumber + ' with Store#' + item.itemStoreId;
			$('#messageBox').modal('show');
			if(whichDate == 'effectiveDate') item.effectiveDate = undefined;
			else if(whichDate == 'expireDate') item.expirationDate = undefined;
			else if(whichDate == 'all'){
				item.effectiveDate = undefined;
				item.expirationDate = undefined;
			}
		}
	}
	
	//rollback
$scope.$on('itemUpdatedRollback', function loadData(event, args) {
		//TODO: check the itemDetails contains the item
		var itemInGrid = false;
		angular.forEach($scope.itemDetails, function(gridItem){
			if(gridItem.itemNumber === args.itemID+''){
				itemInGrid = true;
			}
		});
		
//		if(itemInGrid){
//			console.log("******************Item already exists");
//			return;
//		}
		RESTService.getItemDetails(args.itemID).then(function(results) {
			try {
//				for (var j = 0; j < $scope.itemDetails.length; j++) {
//					if ($scope.itemDetails[j].itemNumber == args.itemID)
//						return;
//				}
				
				results[0].selected = false;
//				console.log(args);
				//if(args.beginDate != undefined) 
//				debugger;
				results[0].effectiveDate = helperService.calculateDate();//new Date();
				results[0].newRetailType ='RB';
				if(args.endDate != undefined){ 
					results[0].expirationDate = new Date(args.endDate);
					//results[0].expirationDate = calculateFutureDate(results[0].effectiveDate);
				}
				if(args.retail != undefined) {results[0].newRetail = retail;}
				//if(args.retailType != undefined) results[0].newRetailType = retailType;
				if(args.linkedNbr != undefined) {results[0].linkedNbr = args.linkedNbr;}
//				console.log(results[0].linkedNbr);
//				debugger;
				$scope.itemDetails = $scope.itemDetails.concat(results);
				console.log($scope.itemDetails);
				$scope.itemDetailsFilter=$scope.itemDetails;
//				console.log('ggg'+results);
				$rootScope.$broadcast('clearSelectAllCheckbox', null);
				$scope.$parent.setItemDetails($scope.itemDetails);
			} catch (e) {
//				$scope.dataLoadError();
				console.log("Item code does not exist");
				return;
			}
		});
	});

//rollback end



/*START effective/future Date Calculation*/	 
   function  calculateFutureDate(){
	   return new Date();
   }

   
   



/*END effective/future Date Calculation*/

function avoidDuplicate(type){
	var retVal = false;
	var types = ['linked'];//array to makes sure the duplicate items are not added
	angular.forEach(types, function(curType){
		if(curType === type){
			retVal = true;
		}
		
	});
	return retVal;
}
	
	
   $scope.$on('itemUpdated', function loadData(event, args) {
	   
	 //TODO: check the itemDetails contains the item
		try{
			if(avoidDuplicate(args.type)){
				var itemInGrid = false;
				if($scope.itemDetails){
					var itemsLen = $scope.itemDetails.length;
					for(var index=0;index<itemsLen;index++){
						if($scope.itemDetails[index] != undefined  && $scope.itemDetails[index].itemNumber === args.itemID+''){
							itemInGrid=true;
							break ;//since item already exists
						}
					}
				}
				
				if(itemInGrid){
					console.log("******************Item already exists");
					return;
				}
			}
			
		}catch(e){
			console.log(e);
		}
		
		RESTService.getItemDetails(args.itemID).then(function(results) {
			try {
//				for (var j = 0; j < $scope.itemDetails.length; j++) {
//					if ($scope.itemDetails[j].itemNumber == args.itemID)
//						return;
//				}
				
				results[0].selected = false;
				results[0].coop = false;
				results[0].showFlag = false;				
				results[0].showDropIcon = false;
				results[0].highlightRetailFlag = false;
				
				
				
//				console.log(args);
				if(args.beginDate != undefined) results[0].effectiveDate = new Date(args.beginDate);
				if(args.endDate != undefined) results[0].expirationDate = new Date(args.endDate);
				if(args.retail != undefined) results[0].newRetail = args.retail;
				if(args.retailType != undefined) results[0].newRetailType = args.retailType;
				$scope.checkForOverlappingDates(results[0], -1, "all");	
				
				
				
				if(args.beginDate == undefined)
                {
                       angular.forEach(results, function(resItem){resItem.effectiveDate = new Date()});
                }
				if(args.endDate == undefined)
                {
                       angular.forEach(results, function(resItem){var curDate = new Date(); 
                       resItem.expirationDate = new Date();
                       resItem.expirationDate.setDate(curDate.getDate()+1);  });
                }
				
				
				
				//logic to group the parent and child items
				if(args.linkedItemNbr != undefined) {
					results[0].itemPrimeFlag = args.linkedItemNbr;
					try{
						if($scope.itemDetails){
							var index = 0, isLinkedAvail = false, itemsLen = $scope.itemDetails.length;
							for(index=0;index<itemsLen;index++){
								if($scope.itemDetails[index] && $scope.itemDetails[index].itemNumber === args.linkedItemNbr){
									isLinkedAvail = true;
									break;
								}
							}							
						}						
						$scope.itemDetails.splice(isLinkedAvail?index+1:index,0,results[0]);
					}catch(e){
						$scope.itemDetails = $scope.itemDetails.concat(results);
					}
				}else{
					$scope.itemDetails = $scope.itemDetails.concat(results);	
				}
//				console.log(results[0].linkedNbr);
				
				$scope.setRelations($scope.itemDetails);	
				$scope.itemDetailsFilter=$scope.itemDetails;
				$scope.itemDetailsItemNoFilter=$scope.itemDetails;
				$scope.itemDetailsItemDescFilter=$scope.itemDetails;
				$scope.itemDetailsItemUpcFilter=$scope.itemDetails;
				$scope.itemDetailsItemStoreFilter=$scope.itemDetails;
				$scope.itemDetailsItemLiTyFilter=$scope.itemDetails;
				$scope.itemDetailsItemUomFilter=$scope.itemDetails;
				$scope.itemDetailsItemColorFilter=$scope.itemDetails;
//				console.log('ggg'+results);
				$rootScope.$broadcast('clearSelectAllCheckbox', null);
				$scope.$parent.setItemDetails($scope.itemDetails);
			} catch (e) {
//				$scope.dataLoadError();
				console.log("Item code does not exist");
				return;
			}
		});
	});
   
   
   // logic for parent-child color
   $scope.setRelations = function(items){
	   try{
		   if(!$scope.gridItemsBeh){
			   $scope.gridItemsBeh={};   
		   }
		   var _behItem, parentItemNumber;
		   
		   //{'itemID':{relType:'parent', styleClass:''}}
		   angular.forEach(items, function(item){
			   _behItem = {};
			   $scope.gridItemsBeh[item.itemNumber]=_behItem;
			   if(item.itemPrimeFlag === 'NA'){
				   parentItemNumber = item.itemNumber;
			   }else{
				   if(parentItemNumber === item.itemPrimeFlag){
					   $scope.gridItemsBeh[item.itemNumber].relType='child';
					   $scope.gridItemsBeh[parentItemNumber].relType='parent';
				   }
			   }
		   });
	   }catch(e){
		   console.log(e);
	   }
   }
   
   
   
//	Advanced Search
	$scope.$on('AdvancedSearch', function loadData(event, args) {
//		debugger;
		console.log("Check argument",args);
		if(args.storeNumber.length!=0 && args.itemNumber.length!=0){
		
			RESTService.getMultipleItemDetails(args).then(function(results) {
					
				//	$rootScope.$broadcast('closeLoading');

				try {
					
					//results.selected = false;
					$scope.itemDetails = $scope.itemDetails.concat(results);
					console.log("results for advanced search "+JSON.stringify(results));
					$rootScope.$broadcast('clearSelectAllCheckbox', null);
					$scope.$parent.setItemDetails($scope.itemDetails);
					if(args.beginDate == undefined)
	                {
	                       angular.forEach(results, function(resItem){resItem.effectiveDate = new Date()});
	                }
					if(args.endDate == undefined)
	                {
	                       angular.forEach(results, function(resItem){var curDate = new Date(); 
	                       resItem.expirationDate = new Date();
	                       resItem.expirationDate.setDate(curDate.getDate()+1);  });
	                }

				} catch (e) {
					console.log("Save data");
//					$scope.dataLoadError();
					return;
				}
			});
		}
	});

	$scope.$on('filterItemGrid', function loadData(event, args) {		
		debugger;		
		for(var i = 0; i < $scope.itemDetails.length; i++){
			$scope.changeBorderColor($scope.itemDetails[i].itemNumber, 'CCCCCC');
			if($scope.itemDetails[i].selected){ 				
				
				
				$scope.applyRulesChanges(i);
			}
		}	
			
			
	});
	
	$scope.applyRulesChanges = function(index){
		var newObj = {
			id : 'id_' + $scope.itemDetails[index].itemNumber,
			coop : false,
			showFlag : true,
			competitorDetailList : []   
		};	
		RESTService.getUPCData({"upcNo" : $scope.itemDetails[index].itemUPC}).then(function (results) {
//			debugger;
			
			newObj.competitorDetailList = results.competitorDetailList;
			
			$scope.changeBorderColor($scope.itemDetails[index].itemNumber, '990000');
			$scope.itemDetails[index].showDropIcon = !$scope.itemDetails[index].showDropIcon;
			
			if(!checkItemExist('id_' +$scope.itemDetails[index].itemNumber)){				
				$scope.itemDetails.splice((index + 1), 0, newObj);
			}else {
				$scope.itemDetails.splice((index + 1), 1, newObj);
			}	
		});
	}

	$scope.changeBorderColor = function(id, colorCode){
//		debugger;
		var el = $('#id_'+id);
		el.css({'border':'1px solid #'+colorCode});
	};
	
	$scope.$on('itemViolations', function loadData(event, args) {
//		debugger;
		for(var i = 0; i < $scope.itemDetails.length; i++){			
			for(var j=0;j<args.length;j++)
				{
					if(Number($scope.itemDetails[i].itemNumber) === Number(args[j].itemId) && Number($scope.itemDetails[i].itemStoreId) === Number(args[j].storeId)
							&& $filter('date')($scope.itemDetails[i].effectiveDate,"ddMMyyyy") === args[j].startDate && $filter('date')($scope.itemDetails[i].expirationDate,"ddMMyyyy") === args[j].endDate){
						$scope.itemDetails[i].highlightRetailFlag = true;
					}
				}
		}	
	});
	
	$scope.toggleDetailsView = function(index){
//		debugger;
		$scope.itemDetails[index+1].toggleFlag = !$scope.itemDetails[index+1].toggleFlag;
	};
		

	function checkItemExist(id) {
//		debugger;
		var flag = false;
		for (var i = 0; i < $scope.itemDetails.length; i++) {
			if ($scope.itemDetails[i].id === id) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	$scope.$on('resetItemDetails', function loadData(event, args){
//		debugger;
		for(var i = 0; i < $scope.itemDetails.length; i++) $scope.itemDetails[i].hidden = false; 
	});

	$scope.$on('storeUpdated', function(event, args) {

		var req = [];

		for (var j = 0; j < $scope.itemDetails.length; j++) {
			if($scope.itemDetails[j].selected){
//				$scope.itemDetails[j].itemStoreId = args.storeNumber;
				$scope.checkForOverlappingDates($scope.itemDetails[j], j, 'all');
				req.push({'itemNumber': $scope.itemDetails[j].itemNumber,'storeId': args.storeNumber});
			}
		}

		RESTService.refreshItemDetails(req).then(function (results) {
			try {
				var response = {};
				for (var j = 0; j < results.length; j++) {
					response[results[j].itemNumber] = results[j]; 
				}

				var invalidItemStoreCombinationNum = '';
//				debugger;
				
				for (var j = 0; j < $scope.itemDetails.length; j++) {
					if($scope.itemDetails[j].selected){
						var itemNumber = $scope.itemDetails[j].itemNumber;
						
						if(itemNumber in response){
							$scope.itemDetails[j].itemStoreId = response[itemNumber].storeId;
							$scope.itemDetails[j].itemRetail = response[itemNumber].itemRetail;
							$scope.itemDetails[j].inventory = response[itemNumber].inventory;
							$scope.itemDetails[j].itemCost = response[itemNumber].itemCost;
							$scope.itemDetails[j].sales = response[itemNumber].sales;
						}
						else{
							invalidItemStoreCombinationNum += '#' + itemNumber + ' ';
							$scope.itemDetails[j].itemStoreId = args.storeNumber;
							$scope.itemDetails[j].inventory = 0;
							$scope.itemDetails[j].sales = 0;
						}
					}
				}
				
				if(invalidItemStoreCombinationNum != ''){
					$rootScope.message = 'Item Number/s ' + invalidItemStoreCombinationNum + 'not available in the selected store';
					$('#messageBox').modal('show');
				}
			} catch (e) {
//				$scope.dataLoadError();
				return;
			}
		});
	});

	$scope.gridFilter='';
}
