var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
xhr.open('get', '/nav.html', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) { 
        document.getElementById("navContainer").innerHTML = xhr.responseText;
    } 
}
xhr.send();
