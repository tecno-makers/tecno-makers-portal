<?php

/**
 * @file
 * Contains \Drupal\portfolio\Plugin\views\style\Portfolio.
 */

namespace Drupal\portfolio\Plugin\views\style;

use Drupal\Core\Form\FormStateInterface;
use Drupal\views\Plugin\views\style\StylePluginBase;


/**
 * Style plugin to render each item into Portfolio style.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "portfolio",
 *   title = @Translation("Portfolio"),
 *   help = @Translation("Displays as Portfolio style."),
 *   theme = "portfolio",
 *   display_types = {"normal"}
 * )
 */
class Portfolio extends StylePluginBase {

  /**
   * Does the style plugin allows to use style plugins.
   *
   * @var bool
   */
  protected $usesRowPlugin = TRUE;

  /**
   * Does the style plugin support custom css class for the rows.
   *
   * @var bool
   */
  protected $usesRowClass = TRUE;

  /**
   * Set default options
   */
  protected function defineOptions() {
    $options = parent::defineOptions();

    $settings = _portfolio_get_settings();
    foreach ($settings as $k => $v) {
      $options[$k] = array('default' => $v);
    }
    return $options;
  }

  /**
   * Render the given style.
   */
  public function buildOptionsForm(&$form, FormStateInterface $form_state) {
    parent::buildOptionsForm($form, $form_state);
    $form['content_type'] = array(
      '#title' => t('Content type'),
      '#type' => 'select',
      '#options' => $this->_getBundles(),
      '#default_value' => isset($this->options['content_type']) ? $this->options['content_type'] : '',
    );

    $form['filterField'] = array(
      '#title' => t('Filter by'),
      '#type' => 'select',
      '#options' => $this->_getFillterFields(),
      '#default_value' => isset($this->options['filterField']) ? $this->options['filterField'] : '',
    );
    $form['empty_filter'] = array(
      '#title' => t('Empty filter title'),
      '#type' => 'textfield',
      '#default_value' => isset($this->options['empty_filter']) ? $this->options['empty_filter'] : t('All'),
      '#description' => $this->t('This is default title for filter nothing. Default is: All'),
    );
  }

  /*
   * Returns list of fields for filter
   */

  public function _getFillterFields() {
    $op = array();
    $fields = !empty($this->displayHandler->handlers['field']) ? $this->displayHandler->handlers['field'] : NULL;

    if (!empty($fields)) {
      foreach ($fields as $field_name => $field) {
        $entity_type = $field->getEntityType();
        $fields_def = \Drupal::entityManager()
          ->getFieldStorageDefinitions($entity_type);
        if (isset($fields_def[$field_name])) {
          $def = $fields_def[$field_name];
          $field_setting = $def->getSettings();
          if (isset($field_setting['target_type']) && $field_setting['target_type'] == 'taxonomy_term') {
            $op[$field_name] = isset($field->definition['title']) ? $field->definition['title'] . '(' . $field_name . ')' : $field_name;
          }
        }


      }
    }

    return $op;
  }

  /**
   * Return content types list
   */

  public function _getBundles() {

    $types = node_type_get_types();
    $op = array();
    if (!empty($types)) {
      foreach ($types as $name => $type) {
        $op[$name] = $type->label();
      }
    }
    return $op;
  }
}
