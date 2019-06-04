(function ($, Drupal) {
    Drupal.behaviors.portfolio = {
        attach: function (context, settings) {

            $('.portfolio-wrapper', context).each(function () {
                var portfolio_wrapper = $(this);
                var $filter = portfolio_wrapper.find('.portfolio-filter');
                var $holder = portfolio_wrapper.find('.portfolio-items');

                $filter.find('a').click(function (e) {
                    var $this = $(this);
                    var $filterType = $this.attr('data-id');
                    $filter.find('li').removeClass('active');
                    $this.parent('li').addClass('active');
                    $holder.find('li').each(function () {
                        var $item = $(this);
                        if ($filterType !== '*' && $item.attr('data-id') !== $filterType) {
                            $item.fadeOut('normal').addClass('hidden');
                        } else {
                            $item.fadeIn('slow').removeClass('hidden').animateCss('bounceIn');
                        }
                    });

                    e.preventDefault();
                });

            });


        }
    };


    $.fn.extend({
        animateCss: function (animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            $(this).addClass('animated ' + animationName).one(animationEnd, function () {
                $(this).removeClass('animated ' + animationName);
            });
        }
    });


})(jQuery, Drupal);