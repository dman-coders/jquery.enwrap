/* 
 * Place additional div wrappers around flat HTML markup to denote structure.
 * 
 * Given HTML text made up of paragraphs and H2.H3 structure, find the points
 * in the text that should break into 'sections' based on simple heading
 * rules.
 * Add a wrapper div around each section - containing both header and content
 * Add a wrapper div around the content - all tags and stuff until another 
 * heading of equal weight is encountered.
 * 
 * Turns
 * 
 * h2 Chapter 1
 * p blah blah
 * p blah blah blah
 * h2 Chapter 2
 * p blah blah 
 * h3 Appendix A
 * p blah blah
 * p blah blah
 * h3 Appendix B
 * li blah blah
 * li blah blah
 * 
 * Into 
 * 
 * .section
 *  h2 Chapter 1
 *  .content
 *   p blah blah
 *   p blah blah blah
 *  /.content
 * /.section
 * .section
 * h2 Chapter 2
 *  .content
 *   p blah blah 
 *   .section
 *    h3 Appendix A
 *    .content
 *     p blah blah
 *     p blah blah
 *    /.content
 *   /.section
 *   .section
 *    h3 Appendix B
 *    .content
 *     li blah blah
 *     li blah blah
 *    /.content
 *   /.section
 *  /.content
 * /.section
 *
 * To make it run on h3s and h2s, run twice with two parameters.
 * Low first.
 *   $('.content')
 *     .enwrap({ start_level: 3 })
 *     .enwrap({ start_level: 2 }); 
 * 
 */
(function ($) {
  "use strict";

  // I don't need any state, so just provide the behaviour directly
  // as a jquery action.
  $.fn.enwrap = function (options) {

    var settings = $.extend({
      // These are the defaults.
      // Which H tags should be the root items. h1 = 1, h2 = 2, etc.
      start_level: 2,
      // How many levels of H tags should be processed, including the start_level
      depth: 3,
      // CSS class to apply to each section wrapper div
      section_class: "section",
      // CSS class to apply to each section content wrapper div
      content_class: "section-content",
    }, options );
    
    var scope = $(this);
    var headerTag = 'H' + settings.start_level;
    
    // Need to make sure I don't chunk above my requested level.
    var higherTags = [];
    for (var t=settings.start_level-1;t>0;t--) {
      higherTags['H' + t] = 'H' + t;
    }

    // Check each element that is a direct child of the scope.
    // Pick them off one by one and sort them into more organized boxes.
    var current_section;
    var current_section_content;
    current_section_content = scope;
    
    scope.children().each(function (index, item) {
      if (higherTags[$(this)[0].nodeName]){
        // If I find higher tags than expected, stop what I'm doing and 
        // close the current container. That prevents H2s from swallowing H1s 
        // etc. This makes it safe to run through twice to create nesting.
        current_section_content = scope;
        current_section_content.append(item);
     }
      else if ($(this)[0].nodeName == headerTag){
        // Found a heading. Open a new div and shift all subsequent elements
        // into that until the next heading comes along.
        current_section = $('<div class="' + settings.section_class + '" />');
        scope.append(current_section);
        current_section.append(item);
        current_section_content = $('<div class="' + settings.content_class + '" />');
        current_section.append(current_section_content)
      }
      else {
        current_section_content.append(item);
      }
    });
    
    return this;
  }
  
}(jQuery));