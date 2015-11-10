angular.module("directives")
.directive("itemDetails", itemDetails);

function itemDetails($filter, $rootScope){
	return{
		restrict: 'E',
		scope: {
			data: '=data',
	        gridItemsBeh: '=gridItemsBeh',  
			itemId: '=itemId',
			filterData:'=filterData',
			filteritemnoData:'=filteritemnoData',
			filteritemdescData:'=filteritemdescData',
			filteritemupcData:'=filteritemupcData',
			filteritemstoreData:'=filteritemstoreData',
			filteritemlityData:'=filteritemlityData',
			filteritemuomData:'=filteritemuomData',
			filteritemcolorData:'=filteritemcolorData'
		},
		templateUrl: 'include/scenario/directives/itemDetails.html',
		link: function(scope, element, atr, index){
			
			
			scope.newValueObject = {
				newCost : '',
				newRetail : '',
				newRetailType : '',
				effectiveDate : '',
				expireDate :  ''				
			};
			
			
			scope.$on('itemNumberBroadcast',function loadData(event, args){
//				debugger;
				console.log(args.itemID);
				
//				console.log($scope.itemDetails[i]);
				
				scope.itemId= args.itemID;
				console.log("itemID in itemDetails",scope.itemId);
				
			});
			
			scope.checkForOverlappingDates = function(item, index, whichDate){
				scope.$parent.checkForOverlappingDates(item, index, whichDate);
			};
			//rahul code
			// newItem code start 
			scope.itemId = null;
			scope.$on('itemNumberNew',function loadData(event, args){
//				debugger;
				console.log(args.itemID);
				scope.itemId= args.itemID;
			});
			// newItem code end
			scope.remove = function(item,x){
				//updateSelected('remove', item);
				console.log("Va;ue of x is",x);
				scope.data.splice(x, 1);
				checkSelection();
				if(item.selected){
					updateSelectedItem('remove', item,x)
					scope.$parent.broadcast(scope.selected);
				}
				if(scope.data.length == 0){
					scope.$parent.$parent.itemSelectedLength = 0; 
					scope.checkAll=false;
				}
				scope.$parent.setItemDetails(scope.data);
				scope.$parent.setRelations(scope.data);
				return;	
			}			
			//rahul  code end
			//coop
			
			scope.toggleDetailsView = function(itemNumber, flag){
//				debugger;
				var itemNumber = 'id_'+itemNumber;
				for(var i=0; i<scope.data.length; i++){
					if(scope.data[i].id === itemNumber){
						scope.data[i].coop = !scope.data[i].coop;
					}				
				}
				
				if(flag){
					
				}
			};
			
			//coop end
			
			scope.updateLinkedItems = function(item, field){				
				if(!item.itemPrimeFlag || item.itemPrimeFlag ==='NA'){					
					angular.forEach(scope.data, function(curItem){
						if(item.itemNumber === curItem.itemPrimeFlag){
							curItem[field] = item[field];
						}
					});
				}
				else{
					angular.forEach(scope.data, function(curItem){
						if(item.itemPrimeFlag === curItem.itemNumber){
							curItem[field] = item[field];
						}
					});					
				}			
			}


			scope.toggleLinkedItems = function(item){
				if(item.itemPrimeFlag === 'NA'){
					try{
						angular.forEach(scope.data, function(curItem){
							if(item.itemNumber === curItem.itemPrimeFlag){							
								scope.gridItemsBeh[curItem.itemNumber].isVisible = !scope.gridItemsBeh[curItem.itemNumber].isVisible;
							}
						});
					}catch(e){
						console.log(e);
					}
				}
			}
		
			scope.selected = [];			
			checkSelection = function(){
				var allSelected = true;
				for(var i=0; i<scope.data.length; i++){
					if(!scope.data[i].selected ){
						allSelected = false;
						break;
					}
				}
				scope.checkAll = allSelected;
			};
			
			//rahul code start
			scope.selectAll = function(){
				for(var i=0; i<scope.data.length; i++){
					scope.data[i].selected = scope.checkAll;
				}
				if(scope.data.length==0){
					scope.checkAll=false;
				}
				scope.selected = [];
				if(scope.checkAll){
					for(var i=0;i< scope.data.length ;i ++){
						updateSelectedItem('add',scope.data[i]);
					}
				}
				scope.$parent.broadcast(scope.selected);
			};			
			//rahul code end
			
			//rahul code start
			scope.select = function(item){
				$rootScope.rulesCalLoading = false;
				$rootScope.rulesLoading = true;
				if(!item.selected)	scope.checkAll = false;
				else	checkSelection();				
				var action = (item.selected ? 'add': 'remove');
				updateSelectedItem(action, item);
				scope.$parent.broadcast(scope.selected);
			}
			
			//rahul code end
			updateSelected = function(action,item){	
				var index = findIndexByValue(scope.selected,item.itemNumber);
				if(action === 'add' && index === -1)
					scope.selected.push(item);					
				else if (action === 'remove' && index !== -1)					
					scope.selected.splice(index,1);
			}
			
			//rahul code start
			updateSelectedItem = function(action,item){	
				var index = findIndexByValue(scope.selected,item.itemNumber);
//				if(action === 'add' && index === -1)
				if(action=='add')
					scope.selected.push(item);					
				else if (action === 'remove')					
					scope.selected.splice(index,1);
			}			
			//rahul code end
			
			findIndexByValue = function(obj,value){
				for(var i=0;i<obj.length;i++){
					if(obj[i].itemNumber === value)return i;
				}
				return -1;
			}
			
			scope.$on('clearSelectAllCheckbox',
				function loadData(event, args){
					scope.checkAll = false;
			});
			scope.$on('ItemsCheck',
					function loadData(event, args){
				console.log("hi");
				var count=0;
				for(i=0;i<args.length;i++){
					if(args[i].selected=="true")
						{
						count++;
						args[i].selected=true;
						}
				}
				if(args.length==count)
					{
					scope.checkAll = true;
					}
				else
					{
					scope.checkAll = false;
					}
				
						
				});
			
			scope.coopDropDown = function(effectiveDate,competitorCode, index){
				if(effectiveDate!=null){
					scope.coopClickEvent(effectiveDate,competitorCode, index);
				}
				
			};
			
			scope.coopClickEvent = function(effectiveDate,competitorCode, index){
				var effectiveDateCopy = effectiveDate;
				var dayName = $filter('date')(new Date(effectiveDateCopy), 'EEEE');
				if(newRetailType=="{{item.competitorDetailList.competitorCode}}"){
				var numberOfDaysToAdd = 91;
				effectiveDateCopy=new Date(effectiveDateCopy);
				
				}
				if(newRetailType=="{{item.competitorDetailList.competitorCode}}" && dayName!="Tuesday"){
					$rootScope.message = "Effective day for a coop item should be Tuesday";
					$("#messageBox").modal('show');

					scope.data[index].effectiveDate=null;
			
				}
			};

			
			scope.rbDropDown = function(effectiveDate,newRetailType, index){
				if(effectiveDate!=null){
					scope.rbClickEvent(effectiveDate,newRetailType, index);
				}
				
			};
			
			scope.rbClickEvent = function(effectiveDate,newRetailType, index){
				var effectiveDateCopy = effectiveDate;
				var dayName = $filter('date')(new Date(effectiveDateCopy), 'EEEE');
				if(newRetailType=="RB"){
				var numberOfDaysToAdd = 91;
				effectiveDateCopy=new Date(effectiveDateCopy);
				var expDate = effectiveDateCopy;
				expDate.setDate(expDate.getDate() + numberOfDaysToAdd);
				
				scope.data[index].expirationDate=new Date(expDate);
				}
				if(newRetailType=="RB" && dayName!="Tuesday"){
					$rootScope.message = "Effective day for a Rollback item should be Tuesday";
					$("#messageBox").modal('show');

					scope.data[index].effectiveDate=null;
					scope.data[index].expirationDate=null;
				}
			};
			
			scope.rbClickEventExp = function(effectiveDate,expirationDate,newRetailType, index){
				try{
						//var expirationDateCopy = expirationDate;
						var expirationDateCopy1 = expirationDate;
						var dayName = $filter('date')(new Date(expirationDate), 'EEEE');
						if(newRetailType=="RB"){
						var numberOfDaysToAdd = 91;
						var effectiveDateCopy1=new Date(effectiveDate);
						var newExpDate=new Date();
						newExpDate.setDate(effectiveDateCopy1.getDate() + numberOfDaysToAdd);
						if(effectiveDate!=null)
						{
						if(new Date(expirationDate).getTime()<new Date(newExpDate).getTime())
						{
							if(newRetailType=="RB" && dayName!="Tuesday")
							{
								$rootScope.message = "Expiry date for a Rollback item cannot be less than 90 days from Effective Date and Expiry day should be a Tuesday";
								$("#messageBox").modal('show');
								scope.data[index].effectiveDate=null;
								scope.data[index].expirationDate=null;
							}
							
							else{
							
								$rootScope.message = "Expiry date for a Rollback item cannot be less than 90 days from Effective Date";
								$("#messageBox").modal('show');
								scope.data[index].effectiveDate=null;
								scope.data[index].expirationDate=null;
							}
							
						}
						}
						
					}
						
					}
				catch(e)
					{
					}
		
					};
			
			scope.gridFilter='';
			scope.gridFilterId='';
			scope.gridFilterTitle='';
			scope.filterToggle=false;
			
			scope.gridFilterSelected=[{key:'No_Filter',checkId:'isItemNoChecked',isAllFilterSelected:false,searchData:''}
			,{key:'Desc_Filter',checkId:'isItemDescChecked',isAllFilterSelected:false,searchData:''}
			,{key:'Upc_Filter',checkId:'isItemUpcChecked',isAllFilterSelected:false,searchData:''}
			,{key:'StrId_Filter',checkId:'isItemStrIdChecked',isAllFilterSelected:false,searchData:''}
			
			,{key:'LiTyp_Filter',checkId:'isItemLnkTypeChecked',isAllFilterSelected:false,searchData:''}
			,{key:'Uom_Filter',checkId:'isItemUomChecked',isAllFilterSelected:false,searchData:''}
			
			,{key:'Colr_Filter',checkId:'isItemColorChecked',isAllFilterSelected:false,searchData:''}];
			
			scope.selectAllFilterCheck = function(param,checkId){
//				angular.forEach(scope.filterData,function(dataItem,index){
//					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
//				});
				angular.forEach(scope.filteritemnoData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
				angular.forEach(scope.filteritemdescData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
				angular.forEach(scope.filteritemupcData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
				angular.forEach(scope.filteritemstoreData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
				angular.forEach(scope.filteritemlityData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
				angular.forEach(scope.filteritemuomData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
				angular.forEach(scope.filteritemcolorData,function(dataItem,index){
					dataItem[checkId]=scope.gridFilterSelected[param].isAllFilterSelected;
				});
			};
			
			scope.deSelectAllFilter=function(data,param,checkId,index)
			{				
				var count=0;	
				//var tempData=scope.filterData;
				//var checkedItemVal='';
				 var checkedItemVal=data[index];
				angular.forEach(data,function(gridFilterItem,index){
					if(gridFilterItem[checkId])
						{
						 
						  count=count+1;						  
						}					
				});
				
				if(count==data.length)
				{
				scope.gridFilterSelected[param].isAllFilterSelected=true;
				
				}
				else{
					scope.gridFilterSelected[param].isAllFilterSelected=false;				
				}	
				//scope.manipulateFilterData(scope.filterData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemnoData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemdescData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemupcData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemstoreData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemlityData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemuomData,param,checkId,checkedItemVal);
				scope.manipulateFilterData(scope.filteritemcolorData,param,checkId,checkedItemVal);

				
			};
			
			scope.manipulateFilterData=function(data,param,checkId,checkedItemVal)
			{
				angular.forEach(data,function(gridFilterItem,index){
					if(param==0)
						{
						if(gridFilterItem.itemNumber==checkedItemVal.itemNumber)
							{
							gridFilterItem[checkId]=checkedItemVal[checkId];
				
							}
						}
					if(param==1)
					{
					if(gridFilterItem.itemDescription==checkedItemVal.itemDescription)
						{
						gridFilterItem[checkId]=checkedItemVal[checkId];
			
						}
					}
					if(param==2)
					{
					if(gridFilterItem.itemUPC==checkedItemVal.itemUPC)
						{
						gridFilterItem[checkId]=checkedItemVal[checkId];
			
						}
					}
					if(param==3)
					{
					if(gridFilterItem.itemStoreId==checkedItemVal.itemStoreId)
						{
						gridFilterItem[checkId]=checkedItemVal[checkId];
			
						}
					}
					if(param==4)
					{
					if(gridFilterItem.linkType==checkedItemVal.linkType)
						{
						gridFilterItem[checkId]=checkedItemVal[checkId];
			
						}
					}
					if(param==5)
					{
					if(gridFilterItem.itemUOM==checkedItemVal.itemUOM)
						{
						gridFilterItem[checkId]=checkedItemVal[checkId];
			
						}
					}
					if(param==6)
					{
					if(gridFilterItem.itemColor==checkedItemVal.itemColor)
						{
						gridFilterItem[checkId]=checkedItemVal[checkId];
			
						}
					}
							
				
			});
			}
			
			scope.funcfilter=function(data)
		     {
				angular.forEach(data,function(dataItem,index){
					   dataItem.isItemNoChecked=false;
					   dataItem.isItemDescChecked=false;
					   dataItem.isItemUpcChecked=false;
					   dataItem.isItemStrIdChecked=false;
					   dataItem.isItemLnkTypeChecked=false;
					   dataItem.isItemUomChecked=false;
					   dataItem.isItemColorChecked=false;
					   //temp.push(dataItem);
					});
		      }
			 //var tempArray=[];
			   scope.openGridFilter=function(event)
			   {
				 
				   if(scope.filteritemnoData.length>0 && scope.filterData[0].isItemNoChecked===undefined)
					   {
				        // var temp=[];
					   //scope.funcfilter(scope.filterData);
					   scope.funcfilter(scope.filteritemnoData);
					   scope.funcfilter(scope.filteritemdescData);
					   scope.funcfilter(scope.filteritemupcData);
					   scope.funcfilter(scope.filteritemstoreData);
					   scope.funcfilter(scope.filteritemlityData);
					   scope.funcfilter(scope.filteritemuomData);
					   scope.funcfilter(scope.filteritemcolorData);
						  //scope.filterArray=temp;
					   }				
				   scope.gridFilterId = $(event.target)[0].id;
				   scope.gridFilterTitle = $($(event.target).parent()[0]).text()+' Filter';
				   var thWidth = $(event.target).parent().offset().left;
				   var n = thWidth+200;
				   $(".grid_filter_drag").css("left",n);				    
				   scope.gridFilter='gridFilter';
			   };
			   scope.checkUncheckAll=function(data,checkId,param)
			   { 
				   var count=0;
				   angular.forEach(data,function(gridFilterItem,index){
						if(gridFilterItem[checkId])
							{
							 
							  count=count+1;						  
							}					
					});
					
					if(count==data.length)
					{
					scope.gridFilterSelected[param].isAllFilterSelected=true;
					
					}
					else{
						scope.gridFilterSelected[param].isAllFilterSelected=false;				
					}	  
			   };
			   scope.executeGridFilter=function(param,filterId)
			   {
				  

				 scope.data=[];			   
                      var count=0;
					   if(filterId==scope.gridFilterSelected[0].key)
						   {
						   for(i=0;i<scope.filteritemnoData.length;i++){
							   if(scope.filteritemnoData[i][param])
							   {
								   scope.data.push(scope.filteritemnoData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemdescData=scope.data;
						    scope.checkUncheckAll(scope.filteritemdescData,'isItemDescChecked',1);
						    scope.filteritemupcData=scope.data;
						    scope.checkUncheckAll(scope.filteritemupcData,'isItemUpcChecked',2);
						    scope.filteritemstoreData=scope.data;
						    scope.checkUncheckAll(scope.filteritemstoreData,'isItemStrIdChecked',3);
						    scope.filteritemlityData=scope.data;
						    scope.checkUncheckAll(scope.filteritemlityData,'isItemLnkTypeChecked',4);
						    scope.filteritemuomData=scope.data;
						    scope.checkUncheckAll(scope.filteritemuomData,'isItemUomChecked',5);
						    scope.filteritemcolorData=scope.data;
						    scope.checkUncheckAll(scope.filteritemcolorData,'isItemColorChecked',6);
						   }
					   else if(filterId==scope.gridFilterSelected[1].key)
					   {
						   for(i=0;i<scope.filteritemdescData.length;i++){
							   if(scope.filteritemdescData[i][param])
							   {
								   scope.data.push(scope.filteritemdescData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemnoData=scope.data;
					     	scope.checkUncheckAll(scope.filteritemnoData,'isItemNoChecked',0);
						    scope.filteritemupcData=scope.data;
						    scope.checkUncheckAll(scope.filteritemupcData,'isItemUpcChecked',2);
						    scope.filteritemstoreData=scope.data;
						    scope.checkUncheckAll(scope.filteritemstoreData,'isItemStrIdChecked',3);
						    scope.filteritemlityData=scope.data;
						    scope.checkUncheckAll(scope.filteritemlityData,'isItemLnkTypeChecked',4);
						    scope.filteritemuomData=scope.data;
						    scope.checkUncheckAll(scope.filteritemuomData,'isItemUomChecked',5);
						    scope.filteritemcolorData=scope.data;
						    scope.checkUncheckAll(scope.filteritemcolorData,'isItemColorChecked',6);
					   }
					   else if(filterId==scope.gridFilterSelected[2].key)
					   {
						   for(i=0;i<scope.filteritemupcData.length;i++){
							   if(scope.filteritemupcData[i][param])
							   {
								   scope.data.push(scope.filteritemupcData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemnoData=scope.data;
					     	scope.checkUncheckAll(scope.filteritemnoData,'isItemNoChecked',0);
						    scope.filteritemdescData=scope.data;
						    scope.checkUncheckAll(scope.filteritemdescData,'isItemDescChecked',1);
						    scope.filteritemstoreData=scope.data;
						    scope.checkUncheckAll(scope.filteritemstoreData,'isItemStrIdChecked',3);
						    scope.filteritemlityData=scope.data;
						    scope.checkUncheckAll(scope.filteritemlityData,'isItemLnkTypeChecked',4);
						    scope.filteritemuomData=scope.data;
						    scope.checkUncheckAll(scope.filteritemuomData,'isItemUomChecked',5);
						    scope.filteritemcolorData=scope.data;
						    scope.checkUncheckAll(scope.filteritemcolorData,'isItemColorChecked',6);
					   }
					   else if(filterId==scope.gridFilterSelected[3].key)
					   {
						   for(i=0;i<scope.filteritemstoreData.length;i++){
							   if(scope.filteritemstoreData[i][param])
							   {
								   scope.data.push(scope.filteritemstoreData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemnoData=scope.data;
					     	scope.checkUncheckAll(scope.filteritemnoData,'isItemNoChecked',0);
						    scope.filteritemdescData=scope.data;
						    scope.checkUncheckAll(scope.filteritemdescData,'isItemDescChecked',1);
						    scope.filteritemupcData=scope.data;
						    scope.checkUncheckAll(scope.filteritemupcData,'isItemUpcChecked',2);
						    scope.filteritemlityData=scope.data;
						    scope.checkUncheckAll(scope.filteritemlityData,'isItemLnkTypeChecked',4);
						    scope.filteritemuomData=scope.data;
						    scope.checkUncheckAll(scope.filteritemuomData,'isItemUomChecked',5);
						    scope.filteritemcolorData=scope.data;
						    scope.checkUncheckAll(scope.filteritemcolorData,'isItemColorChecked',6);
					   }
					   else if(filterId==scope.gridFilterSelected[4].key)
					   {
						   for(i=0;i<scope.filteritemlityData.length;i++){
							   if(scope.filteritemlityData[i][param])
							   {
								   scope.data.push(scope.filteritemlityData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemnoData=scope.data;
					     	scope.checkUncheckAll(scope.filteritemnoData,'isItemNoChecked',0);
						    scope.filteritemdescData=scope.data;
						    scope.checkUncheckAll(scope.filteritemdescData,'isItemDescChecked',1);
						    scope.filteritemupcData=scope.data;
						    scope.checkUncheckAll(scope.filteritemupcData,'isItemUpcChecked',2);
						    scope.filteritemstoreData=scope.data;
						    scope.checkUncheckAll(scope.filteritemstoreData,'isItemStrIdChecked',3);
						    scope.filteritemuomData=scope.data;
						    scope.checkUncheckAll(scope.filteritemuomData,'isItemUomChecked',5);
						    scope.filteritemcolorData=scope.data;
						    scope.checkUncheckAll(scope.filteritemcolorData,'isItemColorChecked',6);
					   }
					   else if(filterId==scope.gridFilterSelected[5].key)
					   {
						   for(i=0;i<scope.filteritemuomData.length;i++){
							   if(scope.filteritemuomData[i][param])
							   {
								   scope.data.push(scope.filteritemuomData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemnoData=scope.data;
					     	scope.checkUncheckAll(scope.filteritemnoData,'isItemNoChecked',0);
						    scope.filteritemdescData=scope.data;
						    scope.checkUncheckAll(scope.filteritemdescData,'isItemDescChecked',1);
						    scope.filteritemupcData=scope.data;
						    scope.checkUncheckAll(scope.filteritemupcData,'isItemUpcChecked',2);
						    scope.filteritemstoreData=scope.data;
						    scope.checkUncheckAll(scope.filteritemstoreData,'isItemStrIdChecked',3);
						    scope.filteritemlityData=scope.data;
						    scope.checkUncheckAll(scope.filteritemlityData,'isItemLnkTypeChecked',4);
						    scope.filteritemcolorData=scope.data;
						    scope.checkUncheckAll(scope.filteritemcolorData,'isItemColorChecked',6);
					   }
					   else if(filterId==scope.gridFilterSelected[6].key)
					   {
						   for(i=0;i<scope.filteritemcolorData.length;i++){
							   if(scope.filteritemcolorData[i][param])
							   {
								   scope.data.push(scope.filteritemcolorData[i]);
								   //scope.data[i].isVisible=false;
							   }
						   }
						    scope.filteritemnoData=scope.data;
					     	scope.checkUncheckAll(scope.filteritemnoData,'isItemNoChecked',0);
						    scope.filteritemdescData=scope.data;
						    scope.checkUncheckAll(scope.filteritemdescData,'isItemDescChecked',1);
						    scope.filteritemupcData=scope.data;
						    scope.checkUncheckAll(scope.filteritemupcData,'isItemUpcChecked',2);
						    scope.filteritemstoreData=scope.data;
						    scope.checkUncheckAll(scope.filteritemstoreData,'isItemStrIdChecked',3);
						    scope.filteritemlityData=scope.data;
						    scope.checkUncheckAll(scope.filteritemlityData,'isItemLnkTypeChecked',4);
						    scope.filteritemuomData=scope.data;
						    scope.checkUncheckAll(scope.filteritemuomData,'isItemUomChecked',5);
					   }
				
				  
				   
				   scope.closeGridFilter();
			   };
			   
			   scope.closeGridFilter=function()
			   {
				   scope.gridFilter='';
				   scope.gridFilterId='';
				   scope.gridFilterTitle='';
			   };			
		}
	};
}
