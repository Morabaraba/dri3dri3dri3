/* global $ _ Backbone Slick dataView */
(function() {
	var app = window.app = window.app || {};
	app.utils = app.utils || {};
	
	
	// you know you are creating a monster with hacks like this
	app.utils.delayedOnMount = function delayedOnMount(delay) {
		setTimeout(function() {
			$.onmount();	
		}, delay);	
	};



	app.utils.$modal = function showModal(content, extraOpts) {
	
var modalHtml = '<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
'  <div class="modal-header">' +
'    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>' +
'    <h3 id="myModalLabel">App Modal</h3>' +
'  </div>' +
'  <div class="modal-body">' +
'    <p>...</p>' +
'  </div>' +
'  <div class="modal-footer">' +
'    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
'    <!-- <button class="btn btn-primary">Save changes</button> -->' +
'  </div>' +
'</div>';

			var opts = _.extend({
				elementId: 'myModal',
				labelElementId : 'myModalLabel',
				label: undefined,
			}, extraOpts);
			var $modal = $(modalHtml) //$( '#' + opts.elementId);
			
			var $modalBody = $modal.find('.modal-body');
			$modalBody.html(content);
			
			if (opts.label) {
				var $modalHeader = $modal.find('#' + opts.labelElementId);
				$modalHeader.html(opts.label)
			};
			
			$modal.on('hidden', function () {
  $modal.destroy();
})

			return $modal;
	}
	
	app.utils.$alert = function alert(content) {
	    if (arguments.length > 1) {
	        content = [];
	        _.each(arguments, function(arg) {
	            if (_.isString(arg)) {
	                content.push(arg);
	            } else if (_.isObject(arg)) {
	                content.push(JSON.stringify(arg));
	            } else {
	                content.push(String(arg));
	            }
	        });
		    content = content.join(' ');
	    };
        var $alertDiv = $('<div class="alert alert-block ">'); // js-app-alert
        //var $closeBtn = $('<button type="button" class="close" data-dismiss="alert">x</button>').appendTo($alertDiv);
        $alertDiv.append(content)
        return $alertDiv;
	};
	
})();
