/**
 * Created by nathan on 2/3/15.
 */

angular.module('blake').directive("copiesForWork", function () {
    return {
        restrict: 'E',
        templateUrl: "/blake/static/directives/copies-for-work/template.html",
        controller: "CopiesForWorkController"
    }
});

angular.module('blake').controller("CopiesForWorkController", ['$scope', 'BlakeDataService', function ($scope, BlakeDataService) {

    $scope.getCopyFirstObject = function (copy) {
        function workMedium(badMedium) {
            switch(badMedium) {
                case "comb":
                    return "com";
                    break;
                case "comdes":
                    return "com";
                    break;
                case "comeng":
                    return "com";
                    break;
                case "spb":
                    return "sp";
                    break;
                case "spdes":
                    return "sp";
                    break;
                case "speng":
                    return "sp";
                    break;
                case "cprint":
                    return "cpd";
                    break;
                case "mono":
                    return "wd";
                    break;
                case "paint":
                    return "pt";
                    break;
                case "pen":
                    return "pid";
                case "penink":
                    return "pid";
                    break;
                case "penc":
                    return "pid";
                    break;
                case "wc":
                    return "wc";
                    break;
                case "ms":
                    return "ms";
                    break;
                case "ltr":
                    return "lt";
                    break;
                case "te":
                    return "typ";
                    break;
                default:
                    return false;
            }
        }

        if ($scope.work) {
            if ($scope.work.medium == 'illbk') {
                return "http://www.blakearchive.org/blake/images/" + copy.bad_id + ".p1.100.jpg";
            }
            else {
                return "http://www.blakearchive.org/blake/images/" + copy.bad_id + ".1." + workMedium($scope.work.medium) + ".100.jpg";
            }
        }
    };

    /**
     * Print out full text for medium instead of abbreviation
     * @param medium
     * @returns {*}
     */
    var getWorkTypeReadable = function(medium) {
         switch(medium) {
                case "illbk":
                    return "Illuminated Books";
                    break;
                case "comb":
                case "comdes":
                case "comeng":
                    return "Commercial Book Illustrations";
                    break;
                case "spb":
                case "spdes":
                case "speng":
                case "cprint":
                    return "Prints";
                    break;
                case "mono":
                case "paint":
                case "pen":
                case "penink":
                case "penc":
                case "wc":
                    return "Drawings and Paintings";
                    break;
                case "ms":
                case "ltr":
                case "te":
                    return "Manuscripts and Typographic Works";
                    break;
                default:
                    return false;
            }
    };

    $scope.$on("workSelectionChange", function () {
        $scope.work = BlakeDataService.getSelectedWork();
        $scope.work.medium_pretty = getWorkTypeReadable($scope.work.medium);
    });

    $scope.$on("workSelectionCopiesChange", function () {
        var data = BlakeDataService.getSelectedWorkCopies();
        data.sort(function (a, b) {
            return a.source.objdescid.compdate["@value"] - b.source.objdescid.compdate["@value"];
        });

        $scope.copies = data;
    });
}]);