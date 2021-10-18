var app = angular.module("myModule", [])
				.controller("myController", function($scope){
				$scope.carts=[];
				$scope.products = [
					{p_id: "1", pname: "Nike", pimage: "NikeImages/1.jpg", pprice: 1000},
					{p_id: "2", pname: "Nike Air", pimage: "NikeImages/2.jpg", pprice: 2000},
					{p_id: "3", pname: "Nike AirMax", pimage: "NikeImages/3.jpg", pprice: 3000},
					
				];
				
				$scope.add_cart = function(product){
					if(product){
						$scope.carts.push({pid: product.pid, pname: product.pname, pprice: product.pprice});
					}	
				}
						
					
				$scope.total = 0;
				
				$scope.setTotals = function(cart){
					if(cart){
						$scope.total += cart.pprice;
					}
				}
				
				$scope.remove_cart = function(cart){
					if(cart){
						$scope.carts.splice($scope.carts.indexOf(cart), 1);
						$scope.total -= cart.pprice;
					}
				}
	});

	app.controller('Header', ['$scope', function($scope) {
  $scope.head = 'Nike Shoes Online Shop';
}]);