/* -----------------------------------------------------------------------------

Subely V2 

File:           JS Core
Version:        1.0
Last change:    21/09/15 
Author:         Subely

-------------------------------------------------------------------------------- */

'use strict';

var firstLoading = true;
$('body').addClass('loading');

var userLang = navigator.language || navigator.userLanguage; 
userLang = userLang.substr(0, 2);
//console.log(userLang.substr(0, 2));

var titleBase = document.title;

var sections = {
    "home": {
        "index": 1,
        "name": "Home",
        "target": "home.html",
        "color": "green",
        "scheme": "dark",
        "ajax": true,
        "external": false,
        "loaded": false
    },
    "products": {
        "index": 2,
        "name": "Products",
        "name-pl": "Produkty",
        "target": "products.html",
        "color": "blue",
        "scheme": "dark",
        "ajax": true,
        "external": false,
        "loaded": false
    },
    "services": {
        "index": 3,
        "name": "Services",
        "name-pl": "Usługi",
        "target": "services.html",
        "color": "orange",
        "scheme": "dark",
        "ajax": true,
        "external": false,
        "loaded": false
    },
    "portfolio": {
        "index": 4,
        "name": "Portfolio",
        "name-pl": "Portfolio",
        "target": "portfolio.html",
        "color": "blue",
        "scheme": "dark",
        "ajax": true,
        "external": false,
        "loaded": false
    },
    "contact": {
        "index": 6,
        "name": "Contact",
        "name-pl": "Kontakt",
        "target": "contact.html",
        "color": "green",
        "scheme": "dark",
        "ajax": true,
        "external": false,
        "loaded": false
    },
    "signin": {
        "index": 5,
        "name": "Sign In",
        "name-pl": "Newsletter",
        "target": "signin.html",
        "color": "blue",
        "scheme": "dark",
        "ajax": true,
        "external": false,
        "loaded": false
    },
    "themes": {
        "name": "DevDuo",
        "target": "http://subely.com/user/Subely/portfolio?ref=Subely",
        "color": "blue",
        "scheme": "dark",
        "ajax": false,
        "external": true
    }
}

// Check current page
var currentView, 
    query = location.search;

var QueryString = function(query) {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
    } 
    return query_string;
};

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

var checkURI = function() {
    query = window.location.search.substring(1);
    //console.log(query);
    currentView = QueryString(query).view;
    if(typeof sections[currentView]=='undefined') currentView = 'home';
    //console.log(QueryString(query).view);
    if(!$.query.get('view')) currentView = 'home';


    if($.query.get('lang')) userLang = $.query.get('lang');
}

var changeURI = function(view) {
    $.query.SET('view', view);
    var newURI = $.query.SET('view', view);
    //console.log(newURI.toString());  
    if(!popstate) history.pushState(currentView, null, newURI.toString());
    //console.log($.query.get('view'));
    //console.log(history);
    popstate = false;
}

checkURI();

$('#header').load('views/' + userLang+'/header.html');
$('#mobile-nav').load('views/' + userLang+'/mobile-nav.html');

Actions.changeView(currentView);

/* history.pushState(null, null, '?section=pioip');
var urlTest = $.query.get('section');
console.log(urlTest); */

// Popstate
var popstate = false;
window.addEventListener('popstate', function(e) {
    popstate = true;
    checkURI();
    Actions.changeView(currentView);
});

$(document).ready(function (){

    // Change View 
    $('body').delegate('a[data-change-view="true"]','click', function(){

        var target = $(this).attr('href');
        Actions.changeView(target);

        return false;

    });

    // Change Language
    $('body').delegate('a[data-change-lang="true"]','click', function(){

        var lang = $(this).attr('data-lang');
        window.location.search = jQuery.query.set('lang', lang);
        console.log(lang);

        return false;

    });

    MobileNav.init();

});

$(window).resize(function(){
    Actions.markMenuItem(currentView);
});


