"use strict";
var Actions = {
        setColorScheme: function(a, b) {
            $("body").attr("data-scheme", a), $("body").attr("data-color", b)
        },
        setHeaderType: function(a) {
            "home" == a ? ($("body").addClass("home"), $("#header").removeClass("header-portable")) : ($("body").removeClass("home"), $("#header").addClass("header-portable"))
        },
        slideUpdateView: function(a) {
            var b = a.find(".swiper-slide-active"),
                c = a.find(".swiper-bgs"),
                d = b.data("scheme"),
                e = b.data("color"),
                f = c.find(".active"),
                g = c.find('div[data-bg="' + b.data("bg") + '"]');
            f.removeClass("active"), g.addClass("active"), Actions.setColorScheme(d, e)
        },
        changeView: function(a) {
            currentView = a;
            var b = $("#content"),
                c = b.find(".section.visible"),
                d = c.attr("id"),
                e = (sections[a], sections[d], $("#mobile-title")),
                f = function(a) {
                    "home" == a ? (document.title = titleBase,
                      e.text("")) : (document.title = titleBase + " - " + sections[a].name,
                      "en" == userLang ? e.text(sections[a].name) : e.text(sections[a]["name-" + userLang]))
                },
                g = function(a) {
                  console.log(firstLoading);
                    firstLoading && ($("body").addClass("site-loaded"), firstLoading = !1),
                      c.removeClass("visible"), b.children("#" + a).show(0, function() {
                        setTimeout(function() {
                            c.hide(0), $("body").removeClass("loading")
                        }, 600), $(this).addClass("visible")
                    }), f(a), Actions.setColorScheme(sections[a].scheme, sections[a].color),
                              Actions.setHeaderType(a),

                              // checks if the button is in the main-nav to markMenuItem
                              // $("#main-nav").find("a[href=" + a + "]").length || a == 'home' ? Actions.markMenuItem(a) : console.log();
                              Actions.markMenuItem(a),

                              $(".typing").html('<span id="typing-text" class="typing-text"></span>'),
                              Components.typingText()
                };

            if ($("body").removeClass("mobile-nav-open"), a != c.attr("id"))
                if ($("body").addClass("loading"), 0 == b.find("#" + a).length) {
                    var h = $("#tmp");
                    h.load("views/" + userLang + "/" + a + ".html #content > section", function(c, d) {
                        $("#loading-overlay").fadeIn(200);
                        var e = $(this),
                            f = h.html();
                        e.waitForImages({
                            finished: function() {
                                $("#loading-overlay").fadeOut(200), b.append(f), g(a), Components.init(), h.html("")
                            },
                            waitForAll: !0
                        })
                    })
                } else
                    g(a);
            return changeURI(a), !1
        },
        markMenuItem: function(a) {
            var b = $("#main-nav"),
                c = $("#nav-selector"),
                d = $("#mobile-nav");
            if (
                  b.find("li.active").removeClass("active"),
                  d.find("li.active").removeClass("active"),
                  b.find("a[href=" + a + "]").parent("li").addClass("active"),
                  d.find("a[href=" + a + "]").parent("li").addClass("active"),
                  !$("body").hasClass("home"),
                  // !$("body").hasClass("login")
                ) {
                var e = b.find("li.active");
                c.css({
                    left: e.offset().left - b.offset().left - 4 + "px",
                    width: e.width() + 8 + "px"
                })
            }
        }
    },
    Components = {
        init: function() {
            this.textSwiper(), this.bgSwiper(), this.typingText(),
            this.servicesSwiper(), this.productsSwiper(), this.projectsSwiper(),
            this.popUp(), this.ajaxModal(), this.forms()
        },
        textSwiper: function() {
            var a = $(".text-swiper");
            if (a.length > 0) {
                new Swiper(".text-swiper", {
                    speed: 400,
                    autoplay: 2500,
                    loop: !0
                })
            }
        },
        bgSwiper: function() {
            $(".bg-swiper").owlCarousel({
                slideSpeed: 3e3,
                singleItem: !0,
                autoPlay: 4500,
                transitionStyle: "fade",
                mouseDrag: !1,
                touchDrag: !1,
                touchRatio: 0
            })
        },
        servicesSwiper: function() {
            var a = $("#services");
            if (a.length > 0 && "services" == currentView) {
                var b = new Swiper(a, {
                    speed: 600,
                    paginationClickable: !0,
                    direction: "vertical",
                    keyboardControl: !0,
                    mousewheelControl: !0,
                    mousewheelSensitivity: 3,
                    slidesPerView: 1,
                    pagination: ".services-pagination"
                });
                b.on("onSlideChangeStart", function(b) {
                    Actions.slideUpdateView(a)
                }), $('*[data-target="next-service"]').on("click", function() {
                    return b.slideNext(800), !1
                }), $('*[data-target="swipe-service"]').on("click", function() {
                    var a = $(this).data("service");
                    return b.slideTo(a, 800), !1
                })
            }
        },
        productsSwiper: function() {
            var a = $("#products");
            if (a.length > 0 && "products" == currentView) {
                new Swiper(a, {
                    speed: 300,
                    paginationClickable: !0,
                    direction: "vertical",
                    keyboardControl: !0,
                    mousewheelControl: !0,
                    mousewheelSensitivity: 1,
                    slidesPerView: "auto",
                    pagination: ".products-pagination"
                })
            }
        },
        projectsSwiper: function() {
            var a = $("#portfolio");
            if (a.length > 0 && "portfolio" == currentView) {
                var b = new Swiper(a, {
                    speed: 800,
                    paginationClickable: !0,
                    direction: "vertical",
                    keyboardControl: !0,
                    mousewheelControl: !0,
                    slidesPerView: "auto",
                    pagination: ".portfolio-pagination"
                });
                b.on("onSlideChangeStart", function(b) {
                    Actions.slideUpdateView(a)
                })
            }
        },
        typingText: function() {
            function a(a, b) {
                return Math.floor(Math.random() * (b - a + 1)) + a
            }
            var b = [["Whould you like to work with us?", "Let's create something together! ^1000 <a href='contact' data-change-view='true' class='text-primary'>Get free quote!</a>"]],
                c = [["Chciałbyś ze mną współpracować?", "Stwórzmy coś razem! ^1000 <a href='contact' data-change-view='true' class='text-primary'>Otrzymaj darmową wycenę!</a>"]],
                d = $("#typing-text"),
                e = function() {
                    var d;
                    d = "pl" == userLang ? c : b;
                    var e = a(0, d.length - 1);
                    return d[e]
                };
            d.typed({
                strings: e(),
                startDelay: 600,
                typeSpeed: 10,
                contentType: "html",
                backDelay: 2500
            })
        },
        popUp: function() {
            $('[data-toggle="popup"]').on("click", function() {
                var a = $("#" + $(this).data("target"));
                a.is(":hidden") ? a.delay(600).show(0, function() {
                    $("body").addClass("popup-open")
                }) : (a.fadeOut(200), $("body").removeClass("popup-open"))
            })
        },
        ajaxModal: function() {
            var a = ($("#tmp"), $("#ajax-modal")),
                b = $("body"),
                c = $("#loading-overlay");
            $('[data-toggle="ajax-modal"]').on("click", function() {
                var d = $(this).attr("href");
                return b.addClass("loading"), c.fadeIn(200), a.load(d, function(e, f) {
                    var g = $(this);
                    console.log(d), g.waitForImages({
                        finished: function() {
                            a.show(0, function() {
                                c.fadeOut(200), b.addClass("ajax-modal-open").removeClass("loading")
                            }), console.log("Ajax Images Loaded!")
                        },
                        waitForAll: !0
                    })
                }), !1
            }), $("body").delegate(".ajax-close", "click", function() {
                return $("body").removeClass("ajax-modal-open"), setTimeout(function() {
                    a.hide(0)
                }, 400), window.scrollTo(0, 0), !1
            })
        },
        forms: function() {
            $(".validate-form").validate({
                validClass: "valid",
                errorClass: "error",
                onfocusout: function(a, b) {
                    $(a).valid()
                },
                errorPlacement: function(a, b) {
                    return !0
                },
                rules: {
                    email: {
                        required: !0,
                        email: !0
                    }
                }
            });
            var a = $("#sign-in-form");
            a.length > 0 && a.submit(function() {
                var a,
                    b = $(this).find(".btn-submit"),
                    c = $(this);
                return !!c.valid() && (b.addClass("loading"), $.ajax({
                        type: c.attr("method"),
                        url: c.attr("action"),
                        data: c.serialize(),
                        cache: !1,
                        dataType: "jsonp",
                        jsonp: "c",
                        contentType: "application/json; charset=utf-8",
                        error: function(a) {
                            setTimeout(function() {
                                b.addClass("error")
                            }, 1200)
                        },
                        success: function(c) {
                            console.log(c), a = "success" != c.result ? "error" : "success", setTimeout(function() {
                                b.addClass(a)
                            }, 1200)
                        },
                        complete: function() {
                            setTimeout(function() {
                                b.removeClass("loading error success")
                            }, 9200)
                        }
                    }), !1)
            });
            var b = $("#contact-form");
            b.length > 0 && b.submit(function() {
                var a,
                    b = $(this).find(".btn-submit"),
                    c = $(this);
                return !!c.valid() && (b.addClass("loading"), $.ajax({
                        type: "POST",
                        url: "assets/php/contact-form.php",
                        data: c.serialize(),
                        error: function(a) {
                            setTimeout(function() {
                                b.addClass("error")
                            }, 1200)
                        },
                        success: function(c) {
                            console.log(c), a = "success" != c ? "error" : "success", setTimeout(function() {
                                b.addClass(a)
                            }, 1200)
                        },
                        complete: function(a) {
                            console.log(a), setTimeout(function() {
                                b.removeClass("loading error success")
                            }, 9200)
                        }
                    }), !1)
            })
        }
    },
    MobileNav = {
        init: function() {
            $("body").delegate('[data-target="mobile-nav"]', "click", function() {
                return $("body").toggleClass("mobile-nav-open"), !1
            })
        }
    },
    firstLoading = !0;
$("body").addClass("loading");
var userLang = navigator.language || navigator.userLanguage;
userLang = userLang.substr(0, 2);
var titleBase = document.title,
    sections = {
        home: {
            index: 1,
            name: "Home",
            target: "home.html",
            color: "green",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        products: {
            index: 2,
            name: "Products",
            "name-pl": "Produkty",
            target: "products.html",
            color: "blue",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        services: {
            index: 3,
            name: "Services",
            "name-pl": "Usługi",
            target: "services.html",
            color: "orange",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        portfolio: {
            index: 4,
            name: "Portfolio",
            "name-pl": "Portfolio",
            target: "portfolio.html",
            color: "blue",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        contact: {
            index: 6,
            name: "Contact",
            "name-pl": "Kontakt",
            target: "contact.html",
            color: "green",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        signin: {
            index: 5,
            name: "Sign In",
            "name-pl": "Newsletter",
            target: "signin.html",
            color: "blue",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        login: {
            index: 6,
            name: "Sign In",
            "name-pl": "Newsletter",
            target: "signin.html",
            color: "blue",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
        },
        themes: {
            name: "DevDuo",
            target: "http://subely.com/user/Subely/portfolio?ref=Subely",
            color: "blue",
            scheme: "dark",
            ajax: !1,
            external: !0
        }
    },
    currentView,
    query = location.search,
    QueryString = function(a) {
        for (var b = {}, c = a.split("&"), d = 0; d < c.length; d++) {
            var e = c[d].split("=");
            if ("undefined" == typeof b[e[0]])
                b[e[0]] = decodeURIComponent(e[1]);
            else if ("string" == typeof b[e[0]]) {
                var f = [b[e[0]], decodeURIComponent(e[1])];
                b[e[0]] = f
            } else
                b[e[0]].push(decodeURIComponent(e[1]))
        }
        return b
    },
    contains = function(a) {
        var b,
            c = a !== a;
        return b = c || "function" != typeof Array.prototype.indexOf ? function(a) {
            var b = -1,
                d = -1;
            for (b = 0; b < this.length; b++) {
                var e = this[b];
                if (c && e !== e || e === a) {
                    d = b;
                    break
                }
            }
            return d
        } : Array.prototype.indexOf, b.call(this, a) > -1
    },
    checkURI = function() {
        query = window.location.search.substring(1),
        currentView = QueryString(query).view,
        "undefined" == typeof sections[currentView] && (currentView = "home"),
        $.query.get("view") || (currentView = "home"),
        $.query.get("lang") && (userLang = $.query.get("lang"))
    },
    changeURI = function(a) {
        $.query.SET("view", a);
        var b = $.query.SET("view", a);
        popstate || history.pushState(currentView, null, b.toString()), popstate = !1
    };


    checkURI(),
    "pl" != userLang && (userLang = "en"),
    $("#header").load("views/" + userLang + "/header.html"),
    $("#mobile-nav").load("views/" + userLang + "/mobile-nav.html"),
    Actions.changeView(currentView);

var popstate = !1;
window.addEventListener("popstate", function(a) {
    popstate = !0, checkURI(), Actions.changeView(currentView)
}), $(document).ready(function() {
    $("body").delegate('a[data-change-view="true"]', "click", function() {
        var a = $(this).attr("href");
        return Actions.changeView(a), !1
    }), $("body").delegate('a[data-change-lang="true"]', "click", function() {
        var a = $(this).attr("data-lang");
        return window.location.search = jQuery.query.set("lang", a), console.log(a), !1
    }), MobileNav.init()
}), $(window).resize(function() {
    Actions.markMenuItem(currentView)
});
