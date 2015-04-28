
var xhr = new XMLHttpRequest();
xhr.open('GET', '/authentication/validate');
xhr.addEventListener('readystatechange', function () {
   if (xhr.readyState === 4) {
       var obj = JSON.parse(xhr.responseText);
       if ( obj.name.length != 0 ) {
           document.querySelector('div.top-nav-info').textContent = "Welcome " + obj.name;
       }

       else {
           document.querySelector('section.authenticate').style.display = 'block';
       }
   }
});
xhr.send();