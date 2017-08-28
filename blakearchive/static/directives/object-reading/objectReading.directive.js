angular.module("blake").controller("ObjectReadingController", function($rootScope, BlakeDataService, $scope, $modal, $cookies, $window) {
    var vm = this;
    vm.bds = BlakeDataService;
    $rootScope.onWorkPage = false;
    $scope.dpi = $rootScope.dpivalue;
    //$rootScope.view.scope = 'both';
    vm.apparatus = 'transcriptions';
    $rootScope.activeapparatus = 'transcriptions';
    $rootScope.hover = false;
    vm.compareCopyObjectsTemp = [];
    vm.compareCopyObjects = {};
    vm.compareCopyId = '';
    vm.compareCopyPrintDateString = '';
    vm.rs = $rootScope;
    vm.zoomMessage = 'Click, then mouse over the image';
    $rootScope.truesize = false;
    vm.showOverlayCompareCopyInfo = false;
    vm.compareCopy = null;
    $rootScope.activeId = '';
    vm.apparatusArray = [];
    vm.isApparatusArrayInit = false;
    $rootScope.descIdFromReadingCompare = null;


    vm.initApparatusArray = function() {
        //console.log('called');
        vm.apparatusArray = [];
        vm.bds.copyObjects.forEach(function(copyObject) {
            vm.apparatusArray.push('');
            //console.log(vm.apparatusArray);
        });
    };

    //console.log(vm.bds);

    vm.zoom = function() {
        $rootScope.zoom = !$rootScope.zoom;
        ////console.log($rootScope.zoom);
    };

    vm.getStrippedDescId = function(desc_id) {
        return desc_id.replace(/\./g, '')
    };

    vm.showTrueSize = function() {
        $rootScope.truesize = !$rootScope.truesize;

        if (!angular.isDefined($cookies.getObject('clientPpi'))) {
            var clientDpiModalInstance = $modal.open({
                template: '<client-ppi></client-ppi>',
                controller: 'ModalController',
                size: 'lg'
            });
        } else {

            if ($rootScope.truesize == true) {
                vm.setTrueSize();
            } else {
                vm.reverseTrueSize();
            }
        }
        //vm.scrollTo();
    }

    $scope.$on('clientPpi::savedPpi', function() {
        if ($rootScope.truesize == true) {
            vm.setTrueSize();
        }
    });

    vm.reverseTrueSize = function() {


        vm.bds.copyObjects.forEach(function(copyObject) {
            var myEl = angular.element(document.querySelector('#' + vm.getStrippedDescId(copyObject.desc_id)));
            myEl.attr('style', 'height:' + '100%' + 'width:' + 'auto');
        });

        if (vm.apparatus == 'comparewith') {
            vm.bds.copyObjects.forEach(function(copyObject) {
                if (vm.compareCopyObjects[copyObject.desc_id] != null) {
                    var myEl = angular.element(document.querySelector('#' + vm.getStrippedDescId(vm.compareCopyObjects[copyObject.desc_id].desc_id)));
                    myEl.attr('style', 'height:' + '100%' + 'width:' + 'auto;' + 'margin-left:' + '15px');
                }
            });
        }
        //vm.scrollTo();

    }


    vm.setTrueSize = function() {
        if (angular.isDefined($cookies.getObject('clientPpi')) && angular.isDefined((vm.bds.copy))) {

            vm.bds.copyObjects.forEach(function(copyObject) {

                var size = copyObject.physical_description.objsize['#text'].split(' '),
                    clientPpi = $cookies.getObject('clientPpi'),
                    x = size[2],
                    y = size[0],
                    unit = size[3],
                    width = x / 2.54 * clientPpi.ppi,
                    height = y / 2.54 * clientPpi.ppi;
                if (unit == 'mm.') {
                    width = width * 10;
                    height = height * 10;
                }
                ////console.log(height);
                var myEl = angular.element(document.querySelector('#' + vm.getStrippedDescId(copyObject.desc_id)));
                myEl.attr('style', 'height:' + height + 'px;' + 'width:' + width + 'px;' + 'margin-right:' + '15px');

                if (vm.apparatus == 'comparewith' && vm.compareCopyObjects[copyObject.desc_id] != null) {
                    var myEl = angular.element(document.querySelector('#' + vm.getStrippedDescId(vm.compareCopyObjects[copyObject.desc_id].desc_id)));
                    myEl.attr('style', 'height:' + height + 'px;' + 'width:' + width + 'px');
                }


            });
        }
    }

    vm.showCompareWithFaster = function(bad_id) {
        vm.compareCopyObjects = {};
        vm.compareCopyObjectsTemp = [];
        vm.apparatusArray = [];

        BlakeDataService.getCopy(bad_id).then(function(resultingCopy) {
            vm.compareCopy = resultingCopy;
            vm.compareCopyId = vm.compareCopy.archive_copy_id;
            vm.compareCopyPrintDateString = vm.compareCopy.print_date_string;
        });
        BlakeDataService.getObjectsForCopy(bad_id).then(function(resultingCopyObjects) {
            vm.bds.copyObjects.forEach(function(copyObject) {
                var keepGoing = true;
            resultingCopyObjects.forEach(function(compareCopyObject) {
                if(keepGoing == true) {
                    if(copyObject.bentley_id == compareCopyObject.bentley_id) {
                        vm.compareCopyObjects[copyObject.desc_id] = compareCopyObject;
                        keepGoing = false;
                    }
                }
                });
            });
            ////console.log(resultingCopyObjects);
        });

        //console.log(vm.compareCopyObjectsTemp);


        vm.apparatus = 'comparewith';
        $rootScope.activeapparatus = 'comparewith';
        if ($rootScope.truesize == true) {
            $rootScope.truesize = false;
            vm.reverseTrueSize();
        }
        //vm.scrollTo();
    }

    vm.showCompareWith = function(bad_id) {

        vm.compareCopyObjects = {};

        BlakeDataService.getCopy(bad_id).then(function(resultingCopy) {
            vm.compareCopy = resultingCopy;
        });
        //console.log(vm.compareCopy);

        vm.bds.copyObjects.forEach(function(copyObject) {
            BlakeDataService.getSameMatrixObjectFromOtherCopy(copyObject.desc_id, bad_id).then(function(result) {
                if (copyObject.desc_id != result.desc_id) {
                    vm.compareCopyObjects[copyObject.desc_id] = result;
                    vm.compareCopyId = result.archive_copy_id;
                    vm.compareCopyPrintDateString = result.copy_print_date_string;
                } else {

                }
            });
        });
        //console.log(vm.compareCopyObjects);

        vm.apparatus = 'comparewith';
        $rootScope.activeapparatus = 'comparewith';
        if ($rootScope.truesize == true) {
            $rootScope.truesize = false;
            vm.reverseTrueSize();
        }
        //vm.scrollTo();
    }

    vm.showIllustrationDescriptions = function() {
        vm.apparatus = 'illustrationdescriptions';
        vm.currentApparatus = $rootScope.activeapparatus;
        $rootScope.activeapparatus = 'illustrationdescriptions';
        vm.apparatusArray = [];
        //if(vm.currentApparatus == 'imagesonly' || vm.currentApparatus == 'transcriptions') {
        //    vm.scrollTo();
        //}
    }

    vm.showTranscriptions = function() {
        vm.apparatus = 'transcriptions';
        $rootScope.activeapparatus = 'transcriptions';
        vm.apparatusArray = [];
        //vm.scrollTo();
    }

    vm.showEditorsNotes = function() {
        vm.apparatus = 'editorsnotes';
        vm.currentApparatus = $rootScope.activeapparatus;
        $rootScope.activeapparatus = 'editorsnotes';
        vm.apparatusArray = [];
        //if(vm.currentApparatus == 'imagesonly' || vm.currentApparatus == 'transcriptions') {
        //    vm.scrollTo();
        //}
        console.log($rootScope.persistentmode);
    }

    vm.showIndividualIllustrationDescriptions = function(index) {
        if(vm.isApparatusArrayInit == false) {
            vm.initApparatusArray();
            vm.isApparatusArrayInit = true;
        }
        vm.apparatusArray[index] = 'illustrationdescriptions';
    }

    vm.showIndividualTranscriptions = function(index) {
        if(vm.isApparatusArrayInit == false) {
            vm.initApparatusArray();
            vm.isApparatusArrayInit = true;
        }
        vm.apparatusArray[index] = 'transcriptions';
    }

    vm.showIndividualEditorsNotes = function(index) {
       if(vm.isApparatusArrayInit == false) {
            vm.initApparatusArray();
            vm.isApparatusArrayInit = true;
        }
        vm.apparatusArray[index] = 'editorsnotes';
    }

    vm.showImagesOnly = function() {
        if(vm.isApparatusArrayInit == true) {
            vm.initApparatusArray();
        }
        vm.apparatus = 'imagesonly';
        $rootScope.activeapparatus = 'imagesonly';
        //vm.scrollTo();
    }

    vm.getOvpTitle = function() {
        if (angular.isDefined(vm.bds.copy)) {
            if (vm.bds.work.virtual == true) {
                if (vm.bds.copy.bad_id == 'letters') {
                    return vm.bds.object.object_group;
                } else {
                    return vm.bds.work.title;
                }
            } else {
                var copyPhrase = vm.bds.copy.archive_copy_id == null ? '' : ', Copy ' + vm.bds.copy.archive_copy_id;

                if (vm.bds.copy.header) {
                    copyPhrase = vm.bds.copy.header.filedesc.titlestmt.title['@reg'] + copyPhrase
                }

                return copyPhrase;
            }
        }
    }

    vm.changeObject = function(object) {
        vm.bds.changeObject(object);
        $rootScope.view.mode = 'object';
        $rootScope.view.scope = 'image';
        $rootScope.persistentmode = 'gallery';
        $rootScope.states.activeItem = 'gallery';
    }

    vm.changeCopy = function(copy_id, desc_id) {
        //console.log(copy_id);
        //console.log(desc_id);
        vm.bds.changeCopy(copy_id, desc_id);
        $rootScope.view.mode = 'object';
        $rootScope.view.scope = 'image';
        $rootScope.persistentmode = 'gallery';
        $rootScope.states.activeItem = 'gallery';
        //if($rootScope.activeapparatus = 'comparewith') {
            vm.apparatus = 'transcriptions';
            $rootScope.activeapparatus = 'transcriptions';
            vm.apparatusArray = [];
        $rootScope.descIdFromReadingCompare = desc_id;
        //}
    }

    vm.cssSafeId = function(string) {
        return string.replace(/\./g, '-');
    }

    vm.scrollTo = function() {
        var target = '#'+vm.cssSafeId($rootScope.activeId).replace(/\./g,'-');
        $rootScope.$broadcast('viewSubMenu::readingMode',{'target': target});
    }

    vm.setActiveId = function(index) {
        //note to mike: if (images only is pressed)
        if($rootScope.activeapparatus == 'imagesonly' && index > 2) {
            $rootScope.activeId = vm.cssSafeId(vm.bds.copyObjects[index-2].desc_id);
        }
        else {
            $rootScope.activeId = vm.cssSafeId(vm.bds.copyObjects[index].desc_id);
        }
        //$rootScope.activeId = id;
        //console.log($rootScope.activeId);
    }

    $scope.$watch(function() {
        return $rootScope.dpivalue;
    }, function() {

        if ($rootScope.dpivalue == '300') {
            $scope.dpi = "300";
        } else {
            $scope.dpi = "100";
        }

    }, true);
});

angular.module('blake').directive("objectReading", function() {
    return {
        restrict: 'E',
        template: require('html-loader!./objectReading.html'),
        controller: "ObjectReadingController",
        controllerAs: 'read',
        bindToController: true
    };
});