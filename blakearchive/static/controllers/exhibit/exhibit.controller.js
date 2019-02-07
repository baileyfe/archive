angular.module('blake').controller('ExhibitController', function (
  $scope,$routeParams,$sce,$rootScope,$window,$modal,$cookies, 
  BlakeDataService,imageManipulation,CompareObjectsFactory,$http) {
    var vm = this;
    var exhibitId = $routeParams.exhibitId;
    vm.exId = exhibitId;
    vm.images = [];
    vm.captions = [];
    $rootScope.showWorkTitle = 'exhibit';
    $rootScope.help = 'exhibit';
    $rootScope.worksNavState = false;
    var currentIndex = 0;
    $rootScope.showArticle = true;
    $rootScope.activeapparatus = 'none';
    $rootScope.borderleftwidth = '13px';
    $rootScope.thumbsliderwidth = '66.3%';
    $rootScope.thumbslidermarginleft = '13px';
    $rootScope.buttonsleft = '75%';

    //vm.the_exhibit = BlakeDataService.getExhibit(exhibitId);

    vm.zoom = function() {
        $rootScope.zoom = !$rootScope.zoom;
        ////console.log($rootScope.zoom);
    };

    vm.toggleArticle = function() {
        if($rootScope.showArticle == true) {
          $rootScope.showArticle = false;
          $rootScope.activeapparatus = 'galleriesonly';
          $rootScope.borderleftwidth = '0px';
          $rootScope.thumbsliderwidth = '100%';
          $rootScope.thumbslidermarginleft = '0px';
          $rootScope.buttonsleft = '83.4%';
        }
        else {
          $rootScope.showArticle = true;
          $rootScope.activeapparatus = 'none';
          $rootScope.borderleftwidth = '13px';
          $rootScope.thumbsliderwidth = '66.3%';
          $rootScope.thumbslidermarginleft = '13px';
          $rootScope.buttonsleft = '75%';
        }

    }

    BlakeDataService.getImagesForExhibit(exhibitId).then(function(result){
      vm.images = result;
      //console.log("--------"+vm.images);
      vm.setNextCaption();
    });

    vm.setNextCaption = function() {
      if (currentIndex >= vm.images.length) {
        return;
      }
      BlakeDataService.getCaptionsForImage(exhibitId, vm.images[currentIndex++].image_id).then(function(r2){
          vm.captions.push(r2);
          vm.setNextCaption();
      });
    }

    $scope.trustAsHtml = function(string) {
      return $sce.trustAsHtml(string);
    };

    vm.scrollTo = function(id) {
        $rootScope.doneSettingCopy = true;
        var target = '#'+id;
        $rootScope.$broadcast('viewSubMenu::readingMode',{'target': target});
        console.log(target);
    }

//vm.images = ["1.1","1.2","1.3"];
//vm.captions = [["ad;lkj","woeijf","Lorem ipsum dolor sit amet, oratio assueverit interpretaris cu quo, his te feugiat legimus. Wisi lorem ius id. Usu ea hinc saepe dictas. Ea regione delectus recusabo quo, in his brute atqui sapientem. At per hinc assum adversarium, duo mandamus voluptatum no. Primis semper constituto te qui. Tale zril aperiam eam ea, phaedrum salutatus tincidunt per cu. Ea exerci urbanitas duo, graeci pertinacia ne pri. Pro suscipiantur disputationi ex. Duo te quidam eripuit consequuntur, definiebas interpretaris cu cum. Qui oportere forensibus contentiones ne, nec lorem omittantur ne. Habeo debet iisque has in, sed id aperiam nostrud neglegentur."],["Mr. Wong noted that getting a small fleet of the trikes on the street and putting them to work would help grow awareness. With so many New Yorkers are always on the street, this should make for easy marketing, not only the bemused citizenry (that’s normal every time they take a prototype out) but also delivery people and executives — potential customers, in other words.","Mr. Wong noted that getting a small fleet of the trikes on the street and putting them to work would help grow awareness. With so many New Yorkers are always on the street, this should make for easy marketing, not only the bemused citizenry (that’s normal every time they take a prototype out) but also delivery people and executives — potential customers, in other words.","opueie"],["zc./mv","Mr. Wong noted that getting a small fleet of the trikes on the street and putting them to work would help grow awareness. With so many New Yorkers are always on the street, this should make for easy marketing, not only the bemused citizenry (that’s normal every time they take a prototype out) but also delivery people and executives — potential customers, in other words.","zckj"]];


    vm.bds= BlakeDataService;
    console.log("Exhibit ID: "+exhibitId);

    $rootScope.doneSettingExhibit = false;
    vm.bds.setSelectedExhibit(exhibitId).then(function(){
      //console.log(">>>>>hey, tae, you were wrong!!!!");
      $rootScope.doneSettingExhibit = true;
      console.log(vm.bds.exhibit);
      vm.scrollTo(1);
    });
    //console.log("===>>>>"+JSON.stringify(vm.bds));
    $http.get("/api/exhibit-html/"+exhibitId).then(function(response){
      vm.exhibit_article_content = $sce.trustAsHtml(response.data);
    });


});
