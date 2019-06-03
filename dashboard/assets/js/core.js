"use strict";

var acctoken = '';

var text = '';

var api_host = '/auth/api.php?endpoint=';

var udata = {
      token: "#tk",

    };

var Actions = {
        // starts dbx
        dbxToken: function(dbxToken='', t='') {
          localStorage['dbxToken'] == null ? (localStorage['dbxToken'] = dbxToken) : null;
         // Cookies.get('t') == null ? (Cookies.get('t') = t) : null;
           $.session.get("t") == null ? (sessionStorage.setItem('t', t)) : null;
        },
        setUData: function() {

          var dbid = Cookies.get('dbid');

          var cookie_udata = Cookies.get('udata');
          if (cookie_udata != udata){
            $.ajax({
                type: 'GET',
                url: api_host + '/display_name?dbid='+ dbid,
                dataType: 'json',
                success: function (response) {
                  udata.displayname = response;
                  Cookies.set('udata', JSON.stringify(udata));
                  // console.log(response);
                },
                error: function(response) {
                  console.log('no display_name');
                }
            });
          }
          $('#display-user-name').html(JSON.parse(cookie_udata).displayname + '<i class="fa fa-angle-right"></i>');
          console.log(JSON.parse(cookie_udata).displayname);
        },
        getToken: function() {
          var token = Cookies.get('t');
          if (token) {
            // console.log(token);
            return token;
          } else if (!token) {
            // console.log("no token");
            $.ajax({
                type: 'GET',
                url: '/auth/getToken.php',
                data: 'data',
                dataType: 'json',
                success: function (response) {
                  // console.log(response);
                  location.reload();
                },
                error: function(response) {
                  // console.log('didnt work');
                }

            });
          }

        },
        getUID: function() {
          var dbid = null;

          console.log("Connecting Dropbox: new Dropbox()...");
          var dbx = new Dropbox({ accessToken: Cookies.get('dbxtoken') });
          console.log("Connected");
          if (Cookies.get('uid') == null) {
            var current_account = (dbx.usersGetCurrentAccount());
            // dbid = current_account._result.account_id;
            dbx.usersGetCurrentAccount()

            .then(function(response) {
              dbid = response.account_id;
              acctoken = dbid;

              //console.log('https://api.subely.com/dbxusers/get/uid/'+ dbid +'?access_token=' + Actions.getToken()+'');

              $.ajax({
                  type: 'GET',
                  url: api_host + '/dbxusers/get/uid/'+ dbid +'?access_token=' + Actions.getToken()+'',
                  data: 'data',
                  dataType: 'json',
                  success: function (response) {
                    Cookies.set('uid', response.data.uid)
                    console.log(response.data.uid);
                    location.reload();
                  },
                  error: function(response) {
                    console.log(response);
                    acctoken = dbid;
                  }

              });
              // return dbid;

            })
            .catch(function(error) {
              console.log(error);
            });
          }
        },

        setColorScheme: function(a, b) {
            $("body").attr("data-scheme", a), $("body").attr("data-color", b)
        },

        // Sets the header to be sticky (service) or non like the (home)
        setHeaderType: function(a) {
            // "home" == a ? ($("body").addClass("home"), $("#header").removeClass("header-portable")) : ($("body").removeClass("home"), $("#header").addClass("header-portable"))

            if ("home" == a) {
              ($("body").addClass("home"), $("#header").addClass("header-portable"))
            } else if ("portable" == sections[a].headerType) {
              ($("body").addClass("home"), $("#header").addClass("header-portable"))
            } else {
              ($("body").removeClass("home"), $("#header").addClass("header-portable"))
            }
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

                // Changes the title
                f = function(a) {
                    "home" == a ? (document.title = titleBase,
                      e.text("")) : (document.title = titleBase + " - " + sections[a].name,
                      "en" == userLang ? e.text(sections[a].name) : e.text(sections[a]["name-" + userLang]))
                },

                //
                g = function(a) {
                    firstLoading && ($("body").addClass("site-loaded"), firstLoading = !1),
                      c.removeClass("visible"), b.children("#" + a).show(0, function() {
                        setTimeout(function() {
                            c.hide(0), $("body").removeClass("loading")
                        }, 600), $(this).addClass("visible")
                      }),
                      f(a),

                      Actions.setColorScheme(sections[a].scheme, sections[a].color),
                      Actions.setHeaderType(a),

                      // checks if the button is in the main-nav to markMenuItem
                      // $("#main-nav").find("a[href=" + a + "]").length || a == 'home' ? Actions.markMenuItem(a) : console.log();
                      Actions.markMenuItem(a),
                      // console.log("a");

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
                  !$("body").hasClass("home")// || !$("body").hasClass("home")
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
            this.popUp(), this.ajaxModal(), this.forms(), this.checkLogin()

            switch(currentView) {
                case "home":
                    Components.addSite();
                    break;
                case "Orange":
                    text = "I am not a fan of orange.";
                    break;
                case "Apple":
                    text = "How you like them apples?";
                    break;
                default:
                    text = "I have never heard of that fruit...";
            }
        },

        addSite: function() {
          var b = $('.add-site')
          var a = $('#add-site');
          a.on('keyup', function() {
            $.ajax({
                type: 'GET',
                url: api_host + '/dbxusers/sub/verify/' + this.value,
                data: 'data',
                dataType: 'json',
                success: function (response) {
                  // console.log(response);
                  b.text('Create Site');
                  b.removeClass('btn-default').addClass('btn-primary');
                  $(".site-add-message").text("This subdomain is available");
                  $(".site-add-message").css({"color": "green"});
                },
                error: function(response) {
                  b.text('Check');
                  b.removeClass('btn-primary').addClass('btn-default');
                  $(".site-add-message").css({"color": "red"});
                  $(".site-add-message").text("This subdomain is not available :(");
                  // console.log('not');
                }
            });
          });
          b.click(function(){
              b.text("Please Wait");
              b.prop('disabled', true);
              $.post(api_host + "/dbxusers/add/subs",
              {
                  access_token: Actions.getToken(),
                  user_id: Cookies.get('uid'),
                  sub_domain: a.val(),
                  provider: "dropbox",
                  www: "Apps/subely/"+a.val(),
                  success: function (response) {

                  },
                  error: function(response) {

                  }
              },
              function(data, status){
                    b.text("Check");
                    b.prop('disabled', false);

                    if(data == 'Your limit has been exceeded' || data == 'You need to buy a package to create your folders' || data == 'Your package has been expired')
                    {
                       $('#myModal').modal('hide');
                       $('#limit_folders_response').text(data);
                       $('#limit_folders').modal('show');
                    }
                    else
                    {
                      // console.log(data);
                      location.reload();
                    }
              });
          });
          $('#add-site').keypress(function (e) {
            if (e.which == 13) {
              b.click();
              return false;
            }
          });

        },

        fillSubs: function() {
         if($('#subs-table').length < 1){
          $.ajax({
              type: 'GET',
              url: api_host + '/dbxusers/get/subs/'+ Cookies.get('uid') +'?access_token=' + Actions.getToken(),
              data: 'data',
              dataType: 'json',
              success: function (response) {
                 //console.log(response);
                var data = response.data;
                  $.each(data, function(index, element) {
                    //console.log(data[index]);
                    $('#subs-table').after('<tr class="">laskdfjlk</tr>');
                    var $tr = $('<tr>').append(
                      $('<td>').html('<a href="https://'+data[index].sub_domain+'">' + data[index].sub_domain + '</a>'),
                      $('<td>').html('<i class="fa fa-check" aria-hidden="true"></i>'),
                      $('<td>').text('[' + data[index].provider + ']/' + data[index].www),
                      $('<td>').text(moment(data[index].created_at).fromNow()),
                      $('<td>').html($('<div style="float: right;">').html('<button data-id="'+ data[index].sub_id +'" type="button" class="btn btn-xs btn-danger delete-folder-modal">Delete</button>'))
                    ).appendTo('#subs-table');

                    // $('body').append($('<div>', {
                      //     text: element.name
                      // }));
                  });

                  $('.delete-folder-modal').click(function()
                  {
                    var dataId = this.getAttribute('data-id');
                    $('.delete-sub').attr("data-id", dataId);
                    $('#delete-folder').modal('show');
                  });
                  // delete btn
                  var $delete_sub = $('.delete-sub');
                  $delete_sub.on("click", function() {
                    var current_sub = this.getAttribute('data-id');
                    var dropbox_check = $('#delete-dropbox-folder').prop("checked");
                    var deletefromdropbox = 0;
                    if(dropbox_check) {
                      deletefromdropbox = 1;
                    } else {
                      deletefromdropbox = 0;
                    }

                    $.ajax({
                        type: 'GET',
                        url: api_host + '/dbxusers/delete/sub/' + current_sub + '?access_token='+Actions.getToken(),
                        data: {
                          'deletefromdropbox': deletefromdropbox,
                        },
                        dataType: 'json',
                        success: function (response) {
                          // console.log(response);
                          location.reload();
                        }
                    });
                  });
              },
              error: function(response) {
                console.log('Failed');
                Cookies.remove('t');
                Cookies.remove('uid');
                Cookies.remove('dbid');
                Cookies.remove('dbxtoken');
                localStorage.clear();
                // window.location = "/?view=dbxlogin";
              }
          });

          }

        },

        checkLogin: function() {
          var path = window.location.pathname;
          if (!Cookies.get('dbxtoken')){
            // window.location = "../?view=dbxlogin";
            // console.log("sdf");
          }
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
                    console.log(d),
                    g.waitForImages({
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
        packages: function(){
          if($('#packages-and-plans').length < 1){
           $.ajax({
                type: 'GET',
                url: 'https://api.subely.com/plans?uid='+Cookies.get('uid'),
                dataType: 'json',
                success: function (response) {

                var check_plan = response.check_plan;

                $.each( response.plans, function( key, value ) {

                  var subscribe_plan = '<a data=' + value.name +' id="get_package_name" class="btn btn-success" role="button" data-toggle="modal" data-target="#payment">Subscribe</a>';

                  if(check_plan != 0)
                  {
                    if(value.id == check_plan.id)
                    {
                       subscribe_plan = '<a data=' + value.name +' class="btn btn-success" role="button">Subscribed</a>';
                    }
                    if(value.id != check_plan.id && value.folders > check_plan.folders)
                    {
                       subscribe_plan = '<a data=' + value.name +' id="get_package_name" class="btn btn-info" role="button" data-toggle="modal" data-target="#payment">Upgrade</a>';
                    }
                    if(value.id != check_plan.id && value.folders < check_plan.folders)
                    {
                       subscribe_plan = '<a data=' + value.name +' id="get_package_name" class="btn btn-warning" role="button" data-toggle="modal" data-target="#payment">Downgrade</a>';
                    }
                  }

                     if(value.price == '0.00')
                     {
                        var free = 'Free';
                     }
                     else
                     {
                        var free = '$ ' + value.price + '<span class="subscript">/mo</span>';
                     }
                   $('#packages-and-plans').append('<div class="col-xs-12 col-md-4">' +
                                                    '<div class="panel panel-success">' +
                                                       '<div class="panel-heading">' +
                                                          '<h3 style="color:black;" class="panel-title">' + value.name +
                                                            '</h3>' +
                                                            '</div>' +
                                                     '<div class="panel-body">' +
                                                        '<div class="the-price">' +
                                                          '<h1>' + free + '</h1>' +
                                                              '</div>' +
                                                              '<table class="table">' +
                                                                 '<tr>' +
                                                                    '<td>' +
                                                          // '<h1> $' + free +
                                                          //   '<span class="subscript">/mo</span></h1>' +
                                                          //        '<small>1 month FREE trial</small>' +
                                                          //     '</div>' +
                                                          //     '<table class="table">' +
                                                          //        '<tr>' +
                                                          //           '<td>' +
                                                                        '1 Account' +
                                                                    '</td>' +
                                                                  '</tr>' +
                                                                  '<tr class="active">' +
                                                                        '<td>' +
                                                                            value.folders + ' Project' +
                                                                        '</td>' +
                                                                  '</tr>' +
                                                                   '<tr>' +
                                                                    '<td>' +
                                                                        '100K API Access' +
                                                                    '</td>' +
                                                                  '</tr>' +
                                                                    '<tr class="active">' +
                                                                      '<td>' +
                                                                        '100MB Storage' +
                                                                      '</td>' +
                                                                  '</tr>' +
                                                                   '<tr>' +
                                                                      '<td>' +
                                                                          'Custom Cloud Services' +
                                                                      '</td>' +
                                                                    '</tr>' +
                                                                  '<tr class="active">' +
                                                                   '<td>' +
                                                                      'Weekly Reports' +
                                                                    '</td>' +
                                                                    '</tr>' +
                                                                  '</table>' +
                                                                  '</div>' +
                                                                  '<div class="panel-footer">' +
                                                                    subscribe_plan +
                                                                    '</div>' +
                                                                    // '<a data=' + value.name +' id="get_package_name" class="btn btn-success" role="button" data-toggle="modal" data-target="#payment">Subscribe</a>' +
                                                                    // '1 month FREE trial</div>' +
                                                                    '</div>' +
                                                                    '</div>' +'');
                    });
                },
                error: function(response) {
                  console.log('no plans available');
                }

            });

          }

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

            $("button").click(function(){
                $("p").toggleClass("main");
            });

            // refresh token

            Actions.getToken();
            Actions.getUID();
            Actions.setUData();

            //dbxlogin
            if (currentView == 'dbxlogin'){
              $.getScript('assets/js/dbx-sdk.min.js', function()
              {
                var dbxToken = getParameterByName('dbxtoken'); // "lorem"
                // window.location.pathname gets current path
                window.history.pushState('obj', 'Subely', '?view=dbxlogin');
                // console.log(getParameterByName('dbxtoken'));

                // "en" == userLang ? e.text(sections[a].name) : e.text(sections[a]["name-" + userLang]))

                // if (!localStorage['dbxToken']) {
                //   Actions.dbxToken(dbxToken);
                // }


/*                var dbx = new Dropbox({ accessToken: 'YOUR_ACCESS_TOKEN_HERE' });

                dbx.filesListFolder({path: ''})
                  .then(function(response) {
                    console.log(response);
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
*/
              });
            }

            // search subs
                (function ($) {

                  var $rows = $('table tr');
                  $('#filter').keyup(function() {
                      var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
                          reg = RegExp(val, 'i'),
                          text;

                      $rows.show().filter(function() {
                          text = $(this).text().replace(/\s+/g, ' ');
                          return !reg.test(text);
                      }).hide();

                      // console.log('done searching');

                      if ($rows.find(':visible').length === 0) {
                        $("#noResults").show();
                      }
                      else{
                        $("#noResults").hide();
                      }
                  });

                    $('#filter').keyup(function () {
                        var rex = new RegExp($(this).val(), 'i');
                        $('.searchable tr').hide();
                        // console.log(JSON.stringify($('.searchable tr')));
                        $('.searchable tr').filter(function () {
                            return rex.test($(this).text());
                        }).show();
                    })

                }(jQuery));

                $('#toggle-sub-view').on('click', function(e) {
                  $('.searchable tr').toggleClass("cell"); //you can list several class names
                  $('thead tr').toggleClass("hidden"); //you can list several class names
                  $('table').toggleClass("card"); //you can list several class names
                  e.preventDefault();
                });

            // Login
            var a = $("#login-form");
            a.length > 0 && a.submit(function() {
                var a,
                    b = $(this).find(".btn-submit"),
                    c = $(this);
                    // console.log(c.valid());
                return !!c.valid() && (b.addClass("loading"), $.ajax({
                        type: c.attr("method"),
                        url: c.attr("action"),
                        crossDomain: true,
                        data: c.serialize(),
                        cache: !1,
                        dataType: "json",
                        // jsonp: "c",
                        crossDomain: true,
                        contentType: "application/json; charset=utf-8",
                        error: function(responseData, textStatus, jqXHR) {
                          var value = responseData.someKey;
                            setTimeout(function() {
                                b.addClass("error")
                                // console.log("qwe");

                            }, 1200)
                        },
                        success: function(c) {
                          // console.log("sdf");
                            console.log(c), responseData = "success" != c.result ? "error" : "success", setTimeout(function() {
                              // console.log("aaaa");

                                b.addClass(responseData)
                            }, 1200)
                        },
                        complete: function() {
                            setTimeout(function() {
                                b.removeClass("loading error success")
                            }, 9200)
                        }
                    }), !1)
            });

            var logout_btn = $("#logout");
            logout_btn.length > 0 && logout_btn.click(function() {
              Cookies.remove('t');
              Cookies.remove('uid');
              Cookies.remove('dbid');
              Cookies.remove('dbxtoken');
              localStorage.clear();
              window.location = "/?view=dbxlogin";
              console.log("Logout");
            });

            // Signin page
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
            loaded: !1,
            headerType: "portable"

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
        dbxlogin: {
            index: 6,
            name: "Login",
            target: "dbxlogin.html",
            color: "green",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1,
            headerType: "portable"
        },
        themes: {
            name: "DevDuo",
            target: "https://subely.com/user/Subely/portfolio?ref=Subely",
            color: "blue",
            scheme: "dark",
            ajax: !1,
            external: !0
        },
        packages: {
            index: 7,
            name: "Packages",
            target: "packages.html",
            color: "green",
            scheme: "dark",
            ajax: !0,
            external: !1,
            loaded: !1
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
}),

$(document).ready(function() {
    if(currentView === 'home'){
      Components.fillSubs();
    }
    $("body").delegate('a[data-change-view="true"]', "click", function() {
        var a = $(this).attr("href");
        if(a == 'packages'){
          Components.packages();
        }
        if(a == 'home')
        {
          Components.fillSubs();
        }
        return Actions.changeView(a), !1
    }), $("body").delegate('a[data-change-lang="true"]', "click", function() {
        var a = $(this).attr("data-lang");
        return window.location.search = jQuery.query.set("lang", a), console.log(a), !1
    }), MobileNav.init()
}), $(window).resize(function() {
    Actions.markMenuItem(currentView)
});


$(document).on('click','#check_changes',(function(){
            $.ajax({
                type: 'GET',
                url: 'https://api.subely.com/fetch-dropbox-changes',
                dataType: 'json',
                success: function (response) {
                   console.log(response);
                   $('#display-dropbox-response').text(response);
                   $('#dropbox-response').modal('show');

                },
                error: function(response) {
                  console.log('didnt work');
                }

            });

}));

if(currentView === 'packages'){
    Components.packages();
}

$(document).on('click','#get_package_name',function(){
  var package_name = $(this).attr('data');
  $('#package-name').val(package_name);
});


$(document).on('click','#submit-payment',(function(e){
e.preventDefault();

var card_no = $("#card_no").val();
var ccExpiryMonth = $("#ccExpiryMonth").val();
var ccExpiryYear = $("#ccExpiryYear").val();
var cvvNumber = $("#cvvNumber").val();
var token = Cookies.get('PHPSESSID');
var user_id = Cookies.get('uid');
var package_name = $("#package-name").val();
            $.ajax({
                type: 'POST',
                url: 'https://api.subely.com/stripe',
                dataType: 'json',
                data: {
                    "_token": token,
                    "user_id": user_id,
                    "card_no": card_no,
                    "ccExpiryMonth": ccExpiryMonth,
                    "ccExpiryYear": ccExpiryYear,
                    "cvvNumber": cvvNumber,
                    "package_name": package_name,
                },
                success: function (response) {
                   console.log(response);

                   $('#display-response').text(response);
                   $('#payment').modal('hide');
                   $('#payment-response').modal('show');
                   if(response == 'Payment Successful')
                   {
                      location.reload();
                   }
                },
                error: function(response) {
                  console.log(response);
                }

            });

}));
