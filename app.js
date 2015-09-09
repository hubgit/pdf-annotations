window.addEventListener('DOMContentLoaded', function () {
	'use strict';

	var input = document.getElementById('input');
	var progress = document.getElementById('progress');
	var container = document.getElementById('container');
	var notes = document.getElementById('notes');

	var handlePDF = function (pdf) {
		var promises = [], promise;

		for (var i = 1; i < pdf.numPages; i++) {
			promise = pdf.getPage(i).then(handlePage);
			promises.push(promise);
		}

		Promise.all(promises).then(function (pages) {
			pages.forEach(handleAnnotations);
			progress.parentNode.removeChild(progress);
		});
	};

	var handlePage = function(page) {
		return page.getAnnotations();
	};

	var handleAnnotations = function (annotations) {
		annotations.forEach(function(annotation) {
			//console.log(annotation);

			// only show text annotations
			if (annotation.subtype !== 'Text') {
				return;
			}

			var title = document.createElement('div');
			title.classList.add('note-title');
			title.textContent = annotation.title;

			var content = document.createElement('div');
			content.classList.add('note-content');
			content.textContent = annotation.content;

			var noteContainer = document.createElement('div');
			noteContainer.classList.add('note');
			noteContainer.appendChild(title);
			noteContainer.appendChild(content);

			notes.appendChild(noteContainer);
		});
	};

	input.addEventListener('change', function(event) {
		progress.textContent = 'Loading…';

		var fileReader = new FileReader();

		fileReader.onload = function() {
			progress.textContent = 'Rendering…';

			var pdf = new Uint8Array(this.result);
			PDFJS.getDocument(pdf).then(handlePDF);
		}

		fileReader.readAsArrayBuffer(event.target.files[0]);
	});
});
