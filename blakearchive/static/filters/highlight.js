angular.module("blake").filter('highlight', function($sce,$rootScope){
    var vm = this;

    vm.runReplace = function(phrase,text){
        /*if (angular.isArray(phrase)){
          console.log("The phrase is an array!!!");
        }
        console.log("===highlight called runReplace!!!: "+phrase)*/
        let phraseArray;
        if (phrase !== ''){
            if (phrase.startsWith('"') && phrase.endsWith('"')) {
                phrase = phrase.replace(/"/g, '');
                text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
                return text;
            }

            if (phrase.indexOf(' ')) {
                if (phrase.indexOf('AND')) {
                    phrase = phrase.replace(/AND/g, '');
                }
                phraseArray = phrase.match(/\w+|"(?:\\"|[^"])+"/g).map(s => s.replace(/['"]/g, ''));
                angular.forEach(phraseArray, function (ph) {
                    //var words = ph.match(/\w+/g);
                    //angular.forEach(words, function (word) {
                    //    ph += word + ".*";
                    //});
                    text = text.replace(new RegExp('(\\b' + ph + '[a-zA-Z]*\\b)', 'gi'), '<span class="highlighted">$1</span>');
                });
                return text;

            }

            text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<span class="highlighted">$1</span>');
        }

        return text;
    }

    return function(text,phrase,alt) {
        if (!angular.isDefined(text) || !angular.isDefined(phrase)) {
            return $sce.trustAsHtml(text);
        }

        if(angular.isDefined(alt) && alt.length > 0){
            angular.forEach(alt, function(spelling){
                var newPhrase = phrase.toLowerCase();
                if(newPhrase.indexOf(spelling.reg) > -1){
                    newPhrase = newPhrase.replace(spelling.reg,spelling.orig);
                    text = vm.runReplace(newPhrase,text);
                }
            });
        }

        return $sce.trustAsHtml(vm.runReplace(phrase,text));
    }
});
