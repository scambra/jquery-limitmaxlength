(function($) {
  $.support = $.support || {};
  $.support.maxLength = 'maxLength' in $('<textarea/>')[0];
  
  $.fn.limitMaxlength = function(options){
    var settings = $.extend({
      attribute: "maxlength",
      onLimit: function(){},
      onEdit: function(){}
    }, options);
    // ignore these keys
    var ignore = [8,9,13,33,34,35,36,37,38,39,40,46];

    // Event handler to limit the textarea
    var limit = function(){
      var textarea = $(this);
      var maxlength = parseInt(textarea.attr(settings.attribute));

      if(textarea.val().length > maxlength){
        textarea.val(textarea.val().substr(0, maxlength));

        // Call the onlimit handler within the scope of the textarea
        $.proxy(settings.onLimit, this)();
      }

      // Call the onEdit handler within the scope of the textarea
      $.proxy(settings.onEdit, this)(maxlength - textarea.val().length);
    }
    
    var onEdit = function() {
      var textarea = $(this),
          maxlength = parseInt(textarea.attr(settings.attribute)),
          code = $.data(this, 'keycode');

      // check if maxlength has a value.
      // The value must be greater than 0
      if (maxlength && maxlength > 0) {

        // continue with this keystroke if maxlength
        // not reached or one of the ignored keys were pressed.
        return ( textarea.val().length < maxlength
                || $.inArray(code, ignore) !== -1
                || this.selectionStart != this.selectionEnd );

        // Call the onlimit handler within the scope of the textarea
        $.proxy(settings.onLimit, this)();
      }

      // Call the onEdit handler within the scope of the textarea
      $.proxy(settings.onEdit, this)(maxlength - textarea.val().length);
    }
    
    var onPaste = function(event) {
      var textarea = $(this);
      var maxlength = parseInt(textarea.attr(settings.attribute));
      var selection = textarea.getSelection();
      var pasteText = (event.originalEvent.clipboardData || clipboardData).getData("text").substring(0, maxlength - textarea.val().length + selection.length);
      var newText = textarea.val().substring(0, selection.start) + pasteText + textarea.val().substring(selection.end);
      textarea.val(newText);
      if (this.selectionStart) this.selectionStart = this.selectionEnd = selection.end - selection.length + pasteText.length;
      return false;
    }

    this.each(limit);

    return this.keypress(onEdit)
          .keydown(function(event) { $.data(this, 'keycode', event.keyCode || event.which); })
          .focus(limit)
          .bind('paste', onPaste);
  }
})(jQuery);