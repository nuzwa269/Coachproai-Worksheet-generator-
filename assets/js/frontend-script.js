/**
 * Coachproai Worksheet Generator - Frontend Script
 *
 * @package CoachproaiWorksheetGenerator
 */
(function($) {
	'use strict';

	$(document).ready(function() {

		// Frontend form submission.
		$('#cpwg-frontend-form').on('submit', function(e) {
			e.preventDefault();

			var type = $('#cpwg-front-type').val();
			var difficulty = $('#cpwg-front-difficulty').val();

			$('#cpwg-frontend-loading').show();
			$('#cpwg-frontend-preview').hide();

			$.ajax({
				url: cpwg_ajax.ajax_url,
				type: 'POST',
				data: {
					action: 'cpwg_generate_worksheet',
					nonce: cpwg_ajax.nonce,
					type: type,
					difficulty: difficulty
				},
				success: function(response) {
					$('#cpwg-frontend-loading').hide();

					if (response.success && response.data && response.data.html) {
						$('#cpwg-frontend-content').html(response.data.html);
						$('#cpwg-frontend-preview').show();
						$('#cpwg-frontend-preview').data('type', type);
						$('#cpwg-frontend-preview').data('difficulty', difficulty);
					} else {
						alert('Error generating worksheet. Please try again.');
					}
				},
				error: function() {
					$('#cpwg-frontend-loading').hide();
					alert('Error generating worksheet. Please try again.');
				}
			});
		});

		// Print button.
		$('#cpwg-front-print').on('click', function() {
			window.print();
		});

		// Download PDF button.
		$('#cpwg-front-download').on('click', function() {
			var type = $('#cpwg-frontend-preview').data('type');
			var difficulty = $('#cpwg-frontend-preview').data('difficulty');
			var $btn = $(this);

			$btn.prop('disabled', true).text('Generating PDF...');

			$.ajax({
				url: cpwg_ajax.ajax_url,
				type: 'POST',
				data: {
					action: 'cpwg_download_pdf',
					nonce: cpwg_ajax.nonce,
					type: type,
					difficulty: difficulty
				},
				success: function(response) {
					$btn.prop('disabled', false).text('Download PDF');

					if (response.success && response.data.pdf_base64) {
						var byteCharacters = atob(response.data.pdf_base64);
						var byteNumbers = new Array(byteCharacters.length);
						for (var i = 0; i < byteCharacters.length; i++) {
							byteNumbers[i] = byteCharacters.charCodeAt(i);
						}
						var byteArray = new Uint8Array(byteNumbers);
						var blob = new Blob([byteArray], { type: 'application/pdf' });

						var link = document.createElement('a');
						link.href = URL.createObjectURL(blob);
						link.download = response.data.filename || 'worksheet.pdf';
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						URL.revokeObjectURL(link.href);
					} else {
						alert('Error generating PDF. Please try again.');
					}
				},
				error: function() {
					$btn.prop('disabled', false).text('Download PDF');
					alert('Error generating PDF. Please try again.');
				}
			});
		});
	});

})(jQuery);
