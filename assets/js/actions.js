/* -----------------------------------------------------------------------------

Subely V2 

File:           JS Core
Version:        1.0
Last change:    21/09/15 
Author:         Subely

-------------------------------------------------------------------------------- */

'use strict';

var Actions = {
    setColorScheme: function(scheme,color) {

        $('body').attr('data-scheme',scheme);
        $('body').attr('data-color',color);

    },
    setHeaderType: function(view) {
        if(view == 'home') {
            $('body').addClass('home');
            $('#header').removeClass('header-portable');
        } else {
            $('body').removeClass('home');
            $('#header').addClass('header-portable');
        }
    },
    slideUpdateView: function($container) {
        var $activeSlide = $container.find('.swiper-slide-active');
        var $bgs = $container.find('.swiper-bgs');
        var scheme = $activeSlide.data('scheme');
        var color = $activeSlide.data('color');

        var $activeBg = $bgs.find('.active');
        var $targetBg = $bgs.find('div[data-bg="'+$activeSlide.data('bg')+'"]');

        $activeBg.removeClass('active');
        $targetBg.addClass('active');

        Actions.setColorScheme(scheme,color);
    },
    changeView: function(view) {

        currentView = view;

        var $content = $('#content');

        var loadingView = true;
        var $visibleSection = $content.find('.section.visible');
        var visibleSectionName = $visibleSection.attr('id');
        var targetView = sections[view];
        var activeView = sections[visibleSectionName];
        var $mobileTitle = $('#mobile-title');

        var changeTitle = function(view) {
            if(view=='home') {
                document.title = titleBase;
                $mobileTitle.text('');
            } else {
                document.title = titleBase + ' - ' + sections[view].name;
                if(userLang=='en') $mobileTitle.text(sections[view].name);
                else $mobileTitle.text(sections[view]['name-'+userLang]);
            }
        }

        var showView = function(view) {

            if(firstLoading) {
                $('body').addClass('site-loaded');
                firstLoading = false;
            }

            $visibleSection.removeClass('visible');
            $content.children('#'+view).show(0,function(){
                setTimeout(function(){
                    $visibleSection.hide(0);
                    $('body').removeClass('loading');
                },600);
                $(this).addClass('visible');
            });

            changeTitle(view);

            Actions.setColorScheme(sections[view].scheme, sections[view].color);
            Actions.setHeaderType(view);
            Actions.markMenuItem(view);

            $('.typing').html('<span id="typing-text" class="typing-text"></span>');
            Components.typingText();
        }

        $('body').removeClass('mobile-nav-open');

        //console.log('view: '+view);
        //console.log('visible: '+$visibleSection.attr('id'));

        if(view!=$visibleSection.attr('id')) {

            $('body').addClass('loading');

            if($content.find('#'+view).length == 0) {

                var $tmp = $('#tmp');

                $tmp.load('views/' + userLang+'/' + view +'.html #content > section', function(response, status){

                    $('#loading-overlay').fadeIn(200);
                    var $self = $(this);
                    var newContent = $tmp.html();

                    $self.waitForImages({
                        finished: function() {
                            $('#loading-overlay').fadeOut(200);
                            //console.info('Images Loaded...')
                            $content.append(newContent);
                            showView(view);
                            Components.init();
                            $tmp.html('');
                        },
                        waitForAll: true
                    });

                });

            } else showView(view);
        }

        changeURI(view);

        return false;

    },
    markMenuItem: function(view) {
        var $mainNav = $('#main-nav');
        var $navSelector = $('#nav-selector');

        var $mobileNav = $('#mobile-nav');

        $mainNav.find('li.active').removeClass('active');
        $mobileNav.find('li.active').removeClass('active');

        $mainNav.find('a[href='+view+']').parent('li').addClass('active');
        $mobileNav.find('a[href='+view+']').parent('li').addClass('active');

        if (!$('body').hasClass('home')) {

            var $activeElement = $mainNav.find('li.active');

            $navSelector.css({
                'left': $activeElement.offset().left - $mainNav.offset().left-4+'px',
                'width': $activeElement.width()+8+'px'
            });
        } 
    }
}
