// отправка формы и работа с файлами
(function() {
  if(!("FormData" in window)) {
    return;
  }

  var form = document.querySelector(".js-contest-form");
  if (form) {
    var allFiles = [];

    form.addEventListener("submit", function(event) {
      event.preventDefault();

      var data = new FormData(form);
      allFiles.forEach(function(element) {
        data.append("images", element.file);
      });
      // console.log(data);
      
      request(data, function(response) {
        console.log(response);
      });

    });

    function request(data, fn) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://simonenko.su/academy/echo?" + (new Date()).getTime());
      xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState == 4) {
          fn(xhr.responseText);
        }
      });
      xhr.send(data);
    }

    if ("FileReader" in window) {
      var area = document.querySelector(".js-upload-images");

      form.querySelector("#upload-photos").addEventListener("change", function() {
          var files = this.files;
          for (var i = 0; i < files.length; i++) {
            preview(files[i]);
          }
          this.value = "";
      });

      function removePreview(img) {
        allFiles = allFiles.filter(function(element) {
          return element.img != img;
        });
        var li = img.parentNode;
        li.parentNode.removeChild(li);
      };

      deleteLinks = document.querySelectorAll(".upload-photos__delete");
      for (var i = 0; i < deleteLinks.length; i++) {
        var link = deleteLinks[i];
        link.addEventListener("click", function(event) {
          event.preventDefault();
          this.parentNode.parentNode.removeChild(this.parentNode);
        });
      }

      function preview(file) {
        if (file.type.match(/image.*/)) {
          var reader = new FileReader();

          reader.addEventListener("load", function(event) {

            var container = document.querySelector(".js-upload-template").cloneNode(true);
            container.classList.remove("js-upload-template");

            var img = container.querySelector(".js-upload-template__img");
            img.title = file.name;
            img.style.backgroundImage = "url(" + event.target.result + ")";
            allFiles.push({file: file, img: img});

            var subscription = container.querySelector(".js-upload-template__img-title");
            subscription.innerText = file.name;

            var deleteLink = container.querySelector(".js-upload-template__delete");
            deleteLink.addEventListener("click", function(event) {
              event.preventDefault();
              removePreview(img);
            });

            area.appendChild(container);
          });

          reader.readAsDataURL(file);
        }
      } 
    }

    
  }
})();


// поле с инкрементом/декрементом
// можно вписать "2", можно вписать "2 чел", можно вписать "2 клевых чела" - работать будет
(function() {
  var incrementElements = document.querySelectorAll(".field-increment");
  if(incrementElements){
    for (var i = 0; i < incrementElements.length; i++) {
      initIncrementField(incrementElements[i]);
    }

    var inputCompanions = document.querySelector(".js-input-companions");
    var area = document.querySelector(".js-companion-template").parentNode;
    
    inputCompanions.addEventListener("change", function(event) {
      var initText = inputCompanions.value;
      var needNumber = parseInt(initText, 10);
      console.log(needNumber);

      var curItems = area.querySelectorAll("li").length - 1;
      console.log(curItems);
      while(curItems > needNumber) {
        curItems--;
        removeCompanion();
      }
      while(curItems < needNumber) {
        curItems++;
        addCompanion();
      }
    });

    var countAllCompaionsForInputName = 2;

    function addCompanion() {
      var companion = document.querySelector(".js-companion-template").cloneNode(true);
      companion.classList.remove("js-companion-template");
      countAllCompaionsForInputName++;
      var allInputs = companion.querySelectorAll("input");
      for(var i = 0; i < allInputs.length; i++) {
        allInputs[i].name += "-" + countAllCompaionsForInputName;
      }
      area.appendChild(companion);
      companion.querySelector(".js-companion-delete").addEventListener("click", function(event) {
        event.preventDefault();
        area.removeChild(this.parentNode);
        changeNumberFlat(inputCompanions, false);
      });
    }

    function removeCompanion() {
      var count = area.querySelectorAll("li").length;
      if(count > 1) {
        area.removeChild(area.querySelectorAll("li")[count - 1]);
      }
    }

    var deleteCompanionsLinks = document.querySelectorAll(".js-companion-delete");
    for (var i = 0; i < deleteCompanionsLinks.length; i++) {
      var link = deleteCompanionsLinks[i];
      link.addEventListener("click", function(event) {
        event.preventDefault();
        this.parentNode.parentNode.removeChild(this.parentNode);
        changeNumberFlat(inputCompanions, false);
      });
    }

    function changeNumberFlat(input, operation) {
      var initText = input.value;
      var initNumber = parseInt(initText, 10);
      var textPosition = 0;

      while(textPosition < initText.length && !isNaN(parseFloat(initText[textPosition]))) {
        textPosition++;
      }
      if(isNaN(initNumber) || initNumber < 0) {
        input.value = 0;
      } 
      else {
        if(operation) {
          initNumber++;
        }
        else {
          initNumber = Math.max(0, initNumber - 1);
        }
        input.value =  initNumber + initText.substr(textPosition);
      }
    }

    function changeNumber(input, operation) {
      var initText = input.value;
      var initNumber = parseInt(initText, 10);
      var textPosition = 0;

      while(textPosition < initText.length && !isNaN(parseFloat(initText[textPosition]))) {
        textPosition++;
      }
      if(isNaN(initNumber) || initNumber < 0) {
        input.value = 0;
      } 
      else {
        if(operation) {
          initNumber++;
          if (input == inputCompanions) {
            addCompanion();
          }
        }
        else {
          initNumber = Math.max(0, initNumber - 1);
          if (input == inputCompanions) {
            removeCompanion();
          }
        }
        input.value =  initNumber + initText.substr(textPosition);
      }
    }

    function initIncrementField(parentBlock) {
      var input = parentBlock.querySelector("input");
      var minus = parentBlock.querySelector(".field-increment__minus");
      var plus = parentBlock.querySelector(".field-increment__plus");  

      if(minus) {
        minus.addEventListener("click", function(){
          changeNumber(input, false);
        });
      }
      if(plus) {
        plus.addEventListener("click", function(){
          changeNumber(input, true);
        });
      }

      input.addEventListener("keydown", function(event) {
        var key = event.keyCode;
        if(key==38) { changeNumber(input, true); } // стрелка вверх
        if(key==40) { changeNumber(input, false); } // стрелка вниз
      });
    }
  }
})();

(function() {
  var toggler = document.getElementById('toggler');
  var menu = document.getElementById('main-nav-list');

  if (toggler && menu) {
    toggler.addEventListener("click", function(event) {
      event.preventDefault();
      menu.classList.toggle('main-nav__list--mobile-active');
      toggler.classList.toggle('main-nav__toggle--close');
    });

    window.addEventListener("keydown", function(event) {
        if (event.keyCode == 27) { 
            if (menu.classList.contains("main-nav__list--mobile-active")) { 
                menu.classList.remove("main-nav__list--mobile-active");
                toggler.classList.remove('main-nav__toggle--close');
            } 
        }
    });
  }
})();

(function() {
  if(document.getElementById('index-map')) {
    var position = [59.938794, 30.323083];
    function showGoogleMaps() {  
        var latLng = new google.maps.LatLng(position[0], position[1]);
     
        var mapOptions = {
            zoom: 16, // initialize zoom level - the max value is 21
            streetViewControl: false, // hide the yellow Street View pegman
            scaleControl: true, // allow users to zoom the Google Map
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: latLng
        };
     
        map = new google.maps.Map(document.getElementById('index-map'),
            mapOptions);
     
        // Show the default red marker at the location
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: false,
            animation: google.maps.Animation.DROP
        });
    }
     
    google.maps.event.addDomListener(window, 'load', showGoogleMaps);
  }
})();










