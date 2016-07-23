window.onload = function() {
  for (var i = 0; i < document.getElementsByClassName('directory').length; i++) {
    document.getElementsByClassName('directory').item(i).onclick = function() {
      this.firstChild.click();
    }
  }
  for (var i = 0; i < document.getElementsByClassName('file').length; i++) {
    document.getElementsByClassName('file').item(i).onclick = function() {
      this.firstChild.click();
    }
  }
}
