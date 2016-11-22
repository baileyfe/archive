(function(){

    /** @ngInject */
    var controller = function($scope,$rootScope,$routeParams,$http,$location){

        var vm = this;

        $rootScope.worksNavState = false;
        $rootScope.showWorkTitle = 'static';
        $rootScope.view.mode = 'static';

        vm.page = $routeParams.initialPage;
        vm.subSelection = 'empty';

        $http.get('/blake/static/controllers/staticpage/meta.json').success(function(data){
            vm.meta = data;
            vm.title = data[vm.page].title;
            $rootScope.staticPageTitle = vm.title;
            if($location.search().p){
                vm.subSelection = $location.search().p;
                console.log($location.search().p);
            } else {
                vm.subSelection = data[vm.page].initial;
            }
            vm.navigation = data[vm.page].subSections;
        });

        vm.changeContent = function(page){
            console.log('changing page to '+page);
            vm.subSelection = page;
            $location.search('p',page);
        }

    }

    angular.module('blake').controller('StaticpageController',controller);

}());
