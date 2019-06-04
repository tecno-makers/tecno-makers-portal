(function ($) {
    Drupal.behaviors.owl = {
        attach: function (context, settings) {
            $('.owl-slider-wrapper', context).each(function () {
                var $this = $(this);
                var $this_settings = $.parseJSON($this.attr('data-settings'));
                $this_settings.afterUpdate = function () {
                    owl_pager_field($this, $this_settings);
                }
                $this_settings.afterInit = function () {
                    owl_pager_field($this, $this_settings);
                }
                $this.owlCarousel($this_settings);

            });


            function owl_pager_field($this, $this_settings) {
                if ($this_settings.hasOwnProperty('pager_content')) {
                    var $pager_content = $this_settings.pager_content;
                    if ($($pager_content).length) {

                        $this.find('.owl-item').each(function (index, value) {
                            var $this_item = $(this);
                            var $pager_content_html = $this_item.find($pager_content).html();
                            var $current_eq = $this.find('.owl-pagination').find('.owl-page').eq(index);
                            if ($current_eq.length) {
                                $current_eq.html($pager_content_html);
                            }
                        });
                    }
                }
            }

        }
    };
})(jQuery);