/* -----------------------------------------------------------------------------

Subely V2

File:           JS Core
Version:        1.0
Last change:    21/09/15
Author:         Subely

-------------------------------------------------------------------------------- */

'use strict';


var Components = {
    init: function() {

        this.textSwiper();
        this.bgSwiper();
        this.typingText();
        this.servicesSwiper();
        this.productsSwiper();
        this.projectsSwiper();
        this.popUp();
        this.ajaxModal();
        this.forms();


    },
    textSwiper: function() {

        var $textSwiperWrapper = $('.text-swiper');

        if($textSwiperWrapper.length > 0) {

            var textSwiper = new Swiper('.text-swiper', {
                speed: 400,
                autoplay: 2500,
                loop: true
            });
        }
    },
    bgSwiper: function() {

        $(".bg-swiper").owlCarousel({
            slideSpeed: 3000,
            singleItem: true,
            autoPlay: 4500,
            transitionStyle: 'fade',
            mouseDrag: false,
            touchDrag: false,
            touchRatio: 0
        });

    },
    servicesSwiper: function() {

        var $services = $('#services');

        if($services.length > 0 && currentView == 'services') {

            var servicesSwiper = new Swiper($services, {
                speed: 600,
                paginationClickable: true,
                direction: 'vertical',
                keyboardControl: true,
                mousewheelControl: true,
                mousewheelSensitivity: 3,
                slidesPerView: 1,
                pagination: '.services-pagination'
            });

            servicesSwiper.on('onSlideChangeStart', function(e) {
                Actions.slideUpdateView($services);
            });

            $('*[data-target="next-service"]').on('click', function(){
                servicesSwiper.slideNext(800);
                return false;
            });

            $('*[data-target="swipe-service"]').on('click', function(){
                var target = $(this).data('service');
                servicesSwiper.slideTo(target,800);
                return false;
            });

        }

    },
    productsSwiper: function() {

        var $products = $('#products');

        if($products.length > 0 && currentView == 'products') {

            var productsSwiper = new Swiper($products, {
                speed: 300,
                paginationClickable: true,
                direction: 'vertical',
                keyboardControl: true,
                mousewheelControl: true,
                mousewheelSensitivity: 1,
                slidesPerView: 'auto',
                pagination: '.products-pagination'
            });

    }


    },
    projectsSwiper: function() {

        var $portfolio = $('#portfolio');

        if($portfolio.length > 0 && currentView == 'portfolio') {

            var projectsSwiper = new Swiper($portfolio, {
                speed: 800,
                paginationClickable: true,
                direction: 'vertical',
                keyboardControl: true,
                mousewheelControl: true,
                slidesPerView: 'auto',
                pagination: '.portfolio-pagination'
            });

            projectsSwiper.on('onSlideChangeStart', function(e) {
                Actions.slideUpdateView($portfolio);
            });

        }


    },
    typingText: function() {

        //console.log('typing');

        var stringsEn = [
            [
                "Whould you like to work with us?",
                "Let's create something together! ^1000 <a href='contact' data-change-view='true' class='text-primary'>Get free quote!</a>"
            ]
        ]

        var stringsPl = [
            [
                "Chciałbyś ze mną współpracować?",
                "Stwórzmy coś razem! ^1000 <a href='contact' data-change-view='true' class='text-primary'>Otrzymaj darmową wycenę!</a>"
            ]
        ]

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var $typingContainer = $('#typing-text');

        var stringsSelector = function() {
            var strings;
            if(userLang == 'pl') strings = stringsPl;
            else strings = stringsEn;
            var index = getRandomInt(0,strings.length-1);
            return strings[index];
        }

        $typingContainer.typed({
            strings: stringsSelector(),
            startDelay: 600,
            typeSpeed: 10,
            contentType: 'html',
            backDelay: 2500
        });
    },
    popUp: function() {
        $('[data-toggle="popup"]').on('click', function(){
            var $target = $('#'+$(this).data('target'));
            if($target.is(':hidden')) {
                $target.delay(600).show(0,function(){
                    $('body').addClass('popup-open');
                })
            } else {
                $target.fadeOut(200);
                $('body').removeClass('popup-open');
            }
        });
    },
    ajaxModal: function() {
        var $tmp = $('#tmp'),
            $modal = $('#ajax-modal'),
            $body = $('body'),
            $loadingOverlay = $('#loading-overlay');

        $('[data-toggle="ajax-modal"]').on('click', function(){

            var target = $(this).attr('href');

            $body.addClass('loading');
            $loadingOverlay.fadeIn(200);

            $modal.load(target, function(response, status){

                var $self = $(this);

                console.log(target);

                $self.waitForImages({
                    finished: function() {
                        $modal.show(0, function() {
                            $loadingOverlay.fadeOut(200);
                            $body.addClass('ajax-modal-open').removeClass('loading');
                        });
                        console.log('Ajax Images Loaded!');
                    },
                    waitForAll: true
                });

            });

            return false;
        });
        // Close modal
        $('body').delegate('.ajax-close','click', function(){

            $('body').removeClass('ajax-modal-open');
            setTimeout(function(){
                $modal.hide(0);
            },400);
            window.scrollTo(0,0);

            return false;

        });
    },
    forms: function() {

        $('.validate-form').validate({
            validClass: 'valid',
            errorClass: 'error',
            onfocusout: function(element,event) {
                $(element).valid();
            },
            errorPlacement: function(error,element) {
                return true;
            },
            rules: {
                email: {
                    required    : true,
                    email       : true
                }
            }
        });

        // login
        var $loginForm  = $('#login-form');

        if($loginForm.length>0) {

            $loginForm.submit(function() {
                var $btn = $(this).find('.btn-submit');
                var $form = $(this);
                var response;
                if ($form.valid()){
                    $btn.addClass('loading');
                    $.ajax({
                        type: $form.attr('method'),
                        url:  $form.attr('action'),
                        data: $form.serialize(),
                        cache       : false,
                        dataType    : 'jsonp',
                        jsonp: 'c',
                        contentType: "application/json; charset=utf-8",
                        error       : function(err) { setTimeout(function(){ $btn.addClass('error'); }, 1200); },
                        success     : function(data) {
                            console.log(data);
                            if (data.result != "success") {
                                response = 'error';
                            } else {
                                response = 'success';
                            }
                            setTimeout(function(){
                                $btn.addClass(response);
                            }, 1200);
                        },
                        complete: function() {
                            setTimeout(function(){
                                $btn.removeClass('loading error success');
                            }, 9200);
                        }
                    });
                    return false;
                }
                return false;
            });

        }

        // Sign In
        var $loginForm  = $('#login-form');

        if($loginForm.length>0) {

            $loginForm.submit(function() {
                var $btn = $(this).find('.btn-submit');
                var $form = $(this);
                var response;
                if ($form.valid()){
                    $btn.addClass('loading');
                    $.ajax({
                        type: $form.attr('method'),
                        url:  $form.attr('action'),
                        data: $form.serialize(),
                        cache       : false,
                        dataType    : 'jsonp',
                        jsonp: 'c',
                        contentType: "application/json; charset=utf-8",
                        error       : function(err) { setTimeout(function(){ $btn.addClass('error'); }, 1200); },
                        success     : function(data) {
                            console.log(data);
                            if (data.result != "success") {
                                response = 'error';
                            } else {
                                response = 'success';
                            }
                            setTimeout(function(){
                                $btn.addClass(response);
                            }, 1200);
                        },
                        complete: function() {
                            setTimeout(function(){
                                $btn.removeClass('loading error success');
                            }, 9200);
                        }
                    });
                    return false;
                }
                return false;
            });

        }

        // Contact Form
        var $contactForm  = $('#contact-form');

        if($contactForm.length>0) {

            $contactForm.submit(function() {
                var $btn = $(this).find('.btn-submit');
                var $form = $(this);
                var response;
                if ($form.valid()){
                    $btn.addClass('loading');
                    $.ajax({
                        type: 'POST',
                        url:  'assets/php/contact-form.php',
                        data: $form.serialize(),
                        error       : function(err) { setTimeout(function(){ $btn.addClass('error'); }, 1200); },
                        success     : function(data) {
                            console.log(data);
                            if (data != "success") {
                                response = 'error';
                            } else {
                                response = 'success';
                            }
                            setTimeout(function(){
                                $btn.addClass(response);
                            }, 1200);
                        },
                        complete: function(data) {
                            console.log(data);
                            setTimeout(function(){
                                $btn.removeClass('loading error success');
                            }, 9200);
                        }
                    });
                    return false;
                }
                return false;
            });

        }



    }
}

var MobileNav = {
    init: function() {
        $('body').delegate('[data-target="mobile-nav"]','click', function(){
            $('body').toggleClass('mobile-nav-open');
            return false;
        });
    },
}
