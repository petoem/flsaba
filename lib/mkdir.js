/**
 * mkDir Client Code
 */

document.getElementById("btnMkDir").onclick = function (){
	var dirTM = window.prompt('Please enter new Directory name: ');
	if(dirTM != null){
		dirTM.replace(' ', '_');
		var mkReq = new XMLHttpRequest();
		mkReq.onreadystatechange = function (){
			//if (mkReq.readyState == 4 && mkReq.status == 200)
				window.location.reload(true);
		};
		mkReq.open('POST', '#{mkDIRPlaceHolder}', true);
		mkReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		mkReq.send("newFolderName=" + dirTM);
	}
};