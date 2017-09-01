angular.module("blake").controller("BlakeMenuController",
  function($scope,$rootScope,CartStorageService){
    let vm = this;
    vm.rs = $rootScope;
    $rootScope.cartItems = CartStorageService.cartItems;
    //$scope.$storage = $localStorage;

    vm.openLightBox = function(){
      var win = window.open('','_lightbox','',true);
      if (win.location.href === 'about:blank'){
        win.location.href = '/lightbox';
      }
    };
    vm.clearLightbox = function(){
      console.log("clearing cart!!!");
      CartStorageService.clearCart();
      //window.localStorage.setItem("cart-items-angularjs", "[]");
    }
});

angular.module("blake").directive('blakeMenu', function(){
    return {
        restrict: 'E',
        template: require('html-loader!./template.html'),
        controller: "BlakeMenuController",
        controllerAs: "bm"
    }
});

/*
'Add to Cart' button on copies will add to the storage service (local storage).

hovering over the cart basket will pop up some options for removing specific of all cart items
also should have an option to 'go' to the lightbox window (clicking the basket will also go to
the lightbox window).

The badge in the basket is bound to the count of items in $rootScope.cartItems (which is
bound to the cartItems in the service).
*/
