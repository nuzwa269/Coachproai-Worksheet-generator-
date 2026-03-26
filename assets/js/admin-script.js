/**
 * Coachproai Worksheet Generator - Admin Script
 *
 * @package CoachproaiWorksheetGenerator
 */
(function($) {
	'use strict';

	$(document).ready(function() {

		// Generate worksheet form submission.
		$('#cpwg-generator-form').on('submit', function(e) {
			e.preventDefault();

			var type = $('#cpwg-type').val();
			var difficulty = $('#cpwg-difficulty').val();

			$('#cpwg-generate-btn').prop('disabled', true);
			$('#cpwg-loading').show();
			$('#cpwg-preview-area').hide();

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
					$('#cpwg-loading').hide();
					$('#cpwg-generate-btn').prop('disabled', false);

					if (response.success && response.data && response.data.html) {
						$('#cpwg-preview-content').html(response.data.html);
						$('#cpwg-preview-area').show();

						// Store current type and difficulty for PDF download.
						$('#cpwg-preview-area').data('type', type);
						$('#cpwg-preview-area').data('difficulty', difficulty);
					} else {
						alert('Error generating worksheet. Please try again.');
					}
				},
				error: function() {
					$('#cpwg-loading').hide();
					$('#cpwg-generate-btn').prop('disabled', false);
					alert('Error generating worksheet. Please try again.');
				}
			});
		});

		// Print button.
		$('#cpwg-print-btn').on('click', function() {
			window.print();
		});

		// Download PDF button.
		$('#cpwg-download-btn').on('click', function() {
			var type = $('#cpwg-preview-area').data('type');
			var difficulty = $('#cpwg-preview-area').data('difficulty');
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
					$btn.prop('disabled', false).html('📥 Download PDF');

					if (response.success && response.data.pdf_base64) {
						// Convert base64 to blob and trigger download.
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
					$btn.prop('disabled', false).html('📥 Download PDF');
					alert('Error generating PDF. Please try again.');
				}
			});
		});
	});

})(jQuery);
