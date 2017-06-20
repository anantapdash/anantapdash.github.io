var app = angular.module('SampleWebAPP',
  ['ngTouch',
    'ui.router',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.autoResize',
    'ui.grid.selection',
    'ui.grid.pagination',
    'angular-loading-bar',
    'angular-growl',
    'ngAria',
    'ngAnimate']);

app.config(['growlProvider', function (growlProvider) {
  growlProvider.globalTimeToLive(5000);
}]);
//DatatService created to accesss Web API services hosted in Azure
app.service('dataService', ['$http', '$q', 'growl', function ($http, $q, growl) {
  //function calls get Method
  this.getData = function () {
    var deferred = $q.defer();
    $http.get('/employee.js')
      .then(function (result) {
        deferred.resolve(result.data);
      }, function () {
        deferred.reject(result.data);
      });
    return deferred.promise;
  };
}]).controller('EmployeeController', ['dataService',
  '$scope',
  'uiGridConstants',
  '$q', 'growl',
  function (dataService, $scope, uiGridConstants, $q, growl) {
    $scope.isUserLoggedin = true;
    $scope.title = "Simple Web App";
    $scope.gridOptions = {};
    var promise = dataService.getData();
    promise.then(function (result) {
      $scope.transactionData = result;
      $scope.gridOptions.data = result;
    });
    //function call for insert operation
    //Used UI-Grid to maitain this operation
    $scope.gridOptions.onRegisterApi = function (gridApi) {
      $scope.gridApi = gridApi;
      gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };


    $scope.gridOptions = {
      enableFiltering: true,
      enableRowSelection: true,
      selectionRowHeaderWidth: 35,
      aggregationHideLabel: false,
      rowHeight: 35,
      paginationPageSize: 10,
      paginationPageSizes: [5, 10, 20],
      showGridFooter: true,
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
      },
      columnDefs: [
        { name: 'id', enableCellEdit: false, enableFiltering: false },
        { name: 'name', displayName: 'Name', enableCellEdit: false },
        { name: 'type', displayName: 'Employee Type', enableCellEdit: false },
        { name: 'designation', displayName: 'Employee Designation' },
      ]
    };


  }]);
