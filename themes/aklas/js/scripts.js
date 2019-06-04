/**
 * Created by toan on 2/16/16.
 */
(function ($, Drupal) {
    Drupal.behaviors.aklas = {
        attach: function (context, settings) {
            var baseUrl = settings.path.baseUrl;
            var langcode = settings.path.currentLanguage;

            $(window).load(function () {
                setTimeout(function () {
                    $('body').addClass('loaded');
                    windowScroll();
                }, 500);


            });

            $(document).ready(function () {

                $('#main-menu ul.menu.menu-level--0').slicknav();

                windowScroll();

                // check main menu active items if has mutiple
                var $items = $('#main-menu ul.menu li a.is-active');
                $items.each(function (index, value) {
                    var $item = $(this);
                    if (index !== 0) {
                        $item.removeClass('is-active');
                    }
                    $item.click(function () {
                        $(this).addClass('is-active');
                        $('#main-menu ul.menu li a').removeClass('is-active');
                    });

                });

                // slider full height
                $(window).resize(function () {
                    init_main_menu();
                    $center_section = $('.slide-content');
                    $layout = $(window);
                    $menu_height = $('#header').outerHeight();

                    $center_section.css({
                        //position:'absolute',
                        //left: ($layout.width() - $center_section.outerWidth()) / 2,
                        marginTop: (($layout.height() - $menu_height - $center_section.outerHeight()) / 2)
                    });

                    $('.slide-inner').css({
                        minHeight: $layout.height() - $menu_height
                    });

                    // center portfolio entries.
                    $('.portfolio-items').find('.portfolio-item').each(function () {
                        var $current_portfolio_item = $(this);
                        var $center_outter_div = $current_portfolio_item.find('.views-field-nothing');
                        var $center_inner_div = $center_outter_div.find('.field-content');

                        $center_inner_div.css({
                            marginTop: (($center_outter_div.height() - $center_inner_div.height()) / 2)
                        });
                    });


                });
                $(window).resize();


                $('a[href*="#"]:not([href="#"])'
                ).on('click', function (e) {


                    if (location.pathname.replace(baseUrl, '').replace(langcode, '').replace(/^\//, '') == this.pathname.replace(baseUrl, '').replace(langcode, '').replace(/^\//, '') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        var $hash = this.hash;
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        var scrollToPosition = target.offset().top;
                        if ($('body.header-fixed #header').length) {
                            scrollToPosition = scrollToPosition - $('body.header-fixed #header').outerHeight();
                        }
                        if (target.length) {

                            $('html, body').animate({
                                scrollTop: scrollToPosition
                            }, 600, 'swing');
                            e.preventDefault();
                        }
                    }
                });


                // scroll if click on logo when user is on front page
                $('body.is-front-page .block-system-branding-block a').on('click', function (e) {

                    if ($('#top').length) {
                        $topTarget = $('#top');
                        var $scrollToPosition = $topTarget.offset().top;
                        if ($('body.header-fixed #header').length) {
                            $scrollToPosition = $scrollToPosition - $('body.header-fixed #header').outerHeight();
                        }

                        $('html, body').animate({
                            scrollTop: $scrollToPosition
                        }, 600, 'swing');
                        e.preventDefault();
                    }

                });


            });


            // main menu
            init_main_menu();

            // Label to placeholder
            $("form.contact-form :input, form.user-login-form :input, form.user-register-form :input, form.user-pass :input, form.comment-form :input, .search-page-form :input, #views-exposed-form-blog-blog-page :input").not(':checkbox').each(function (index, elem) {
                var eId = $(elem).attr("id");
                var label = null;
                if (eId && (label = $(elem).parents("form").find("label[for=" + eId + "]")).length == 1) {
                    $(elem).attr("placeholder", $(label).html());
                    $(label).remove();
                }
            });

            // Search text field placeholder
            $('.sidebar input.form-search').attr('placeholder', Drupal.t('keyword ...'));

            $('.block-search .form-actions, .block-views-exposed-filter-blockblog-blog-page .form-actions').click(function () {

                $(this).parents('form').submit();
            });

            // skill bar
            skills_animation(context);


            // main menu active items on scroll
            var $main_menu_items = $('#main-menu ul.menu li a[href*="#"]:not([href="#"])');
            var $window = $(window);

            function menu_check_if_in_view() {
                var window_height = $window.height();
                var window_top_position = $window.scrollTop();
                var window_bottom_position = (window_top_position + window_height);

                $.each($main_menu_items, function () {
                    var $currLink = $(this);
                    var refElement = $('#' + $currLink.attr("href").replace(baseUrl, '').replace(langcode, '').replace('#', '').replace(/^\//, ''));
                    if (refElement.length) {
                        var $element = refElement;
                        var element_height = $element.outerHeight();
                        var element_top_position = $element.offset().top;
                        var element_bottom_position = (element_top_position + element_height);


                        //check to see if this current container is within viewport
                        if ((element_bottom_position >= window_top_position ) &&
                            (element_top_position <= window_bottom_position)) {
                            $main_menu_items.removeClass('is-active');
                            $currLink.addClass('is-active');
                        } else {
                            $currLink.removeClass('is-active');

                        }
                    }

                });
            }

            $window.on('scroll resize', menu_check_if_in_view);
            $window.trigger('scroll');


            function skills_animation(context) {
                $('ul.skills li', context).each(function () {
                    var $this = $(this);
                    var $percent = $this.attr('data-percent');
                    $this.find('span').css({opacity: 0});
                    $this.find('p').animate({
                        width: $percent,
                    }, 9000, function () {
                        $this.find('span').css({opacity: 1}).text($percent);
                    });
                });
            }

            function init_main_menu() {

                var $body_padding = $('body').css('padding-top');
                var $header = $('#header');
                if ($('body.header-fixed #header').length) {
                    $('body.header-fixed header').css({'top': $body_padding});
                    $('body.header-fixed .layout-container').css('padding-top', $header.outerHeight());
                }

                // check if sub menu has active item then add active class to parent
                $('#main-menu ul.menu > li').each(function () {
                    var $parent_item = $(this);
                    var $active_item = $parent_item.find('ul.menu a.is-active');
                    if ($active_item.length) {
                        $parent_item.children('a').addClass('is-active');
                    }
                });

            }

            function windowScroll() {
                if (window.location.hash) {
                    // Fragment exists
                    var $location_target = $(window.location.hash);
                    var $scrollToPosition = $location_target.offset().top;
                    if ($('body.header-fixed #header').length) {
                        $scrollToPosition = $scrollToPosition - $('body.header-fixed #header').outerHeight();
                    }
                    if ($location_target.length) {
                        $('html, body').animate({
                            scrollTop: $scrollToPosition
                        }, 900, 'swing', function () {

                        });
                    }
                }
            }


        }
    };


})(jQuery, Drupal);
