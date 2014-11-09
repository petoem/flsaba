var upDropzone = new Dropzone('html', {
	url: "#{uploadDIRPlaceHolder}",
	method: 'post',
	uploadMultiple: false,
	paramName: "uploadedFile",
	parallelUploads: 20,
	clickable: "#btnUpload",
	maxFiles: null,
	autoProcessQueue: true,
	forceFallback: false,
	createImageThumbnails: false,
	previewsContainer: false,
});

upDropzone.on("success", function(file, responseCode) {
	console.log(responseCode + '->' + file.name);
});

upDropzone.on("totaluploadprogress", function(progress) {
	document.getElementById("progValue").innerHTML = progress.toFixed(2) + ' %';
	document.getElementById("progressBar").value = progress.toFixed(2);
});

upDropzone.on("sending", function(file) {
	document.getElementById("progressBar").style.opacity = 1;
	document.getElementById('progValue').style.opacity = 1;
	document.getElementById('btnUpload').style.opacity = 0;
	document.getElementById('btnUpload').style.display = 'none';
});

upDropzone.on("queuecomplete", function(progress) {
	document.getElementById('progValue').style.opacity = '0';
	document.getElementById("progValue").innerHTML = '0 %';
	document.getElementById('btnUpload').style.opacity = 1;
	window.location.reload(true);
});