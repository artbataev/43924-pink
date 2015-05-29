// отправка формы и работа с файлами
(function() {
  if(!("FormData" in window)) {
    return;
  }

  var form = document.querySelector(".js-contest-form");
  var allFiles = [];

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    var data = new FormData(form);
    allFiles.forEach(function(element) {
      data.append("images", element.file);
    });
    console.log(data);
    
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

    function preview(file) {
      if (file.type.match(/image.*/)) {
        var reader = new FileReader();

        reader.addEventListener("load", function(event) {
          var container = document.createElement("li");
          container.classList.add("user-photo");

          var img = document.createElement("img");
          img.src = event.target.result; 
          img.alt = file.name;

          allFiles.push({file: file, img: img});

          var subscription = document.createElement("span");
          subscription.innerText = file.name;

          var deleteLink = document.createElement("a");
          deleteLink.innerText = "Удалить";
          deleteLink.classList.add("js-delete-image");
          deleteLink.addEventListener("click", function(event) {
            event.preventDefault();
            this.parentNode.remove();
          });

          container.appendChild(img);
          container.appendChild(subscription);
          container.appendChild(deleteLink);

          area.appendChild(container);
        });

        reader.readAsDataURL(file);
      }
    } 
  }

  deleteLinks = document.querySelectorAll(".js-delete-image");
  for (var i = 0; i < deleteLinks.length; i++) {
    var link = deleteLinks[i];
    link.addEventListener("click", function(event) {
      event.preventDefault();
      this.parentNode.remove();
    });
  }

})();


// поле с инкрементом/декрементом
// можно вписать "2", можно вписать "2 чел", можно вписать "2 клевых чела" - работать будет
(function() {
  var incrementElements = document.querySelectorAll(".increment-field");
  for (var i = 0; i < incrementElements.length; i++) {
    initIncrementField(incrementElements[i]);
  }

  function initIncrementField(parentBlock) {
    var input = parentBlock.querySelector("input");
    var minus = parentBlock.querySelector(".increment-field__minus");
    var plus = parentBlock.querySelector(".increment-field__plus");

    if(minus) {
      minus.addEventListener("click", function(){
        changeNumber(false);
      });
    }
    if(plus) {
      plus.addEventListener("click", function(){
        changeNumber(true);
      });
    }

    input.addEventListener("keydown", function(event) {
      var key = event.keyCode;
      console.log(event.keyCode);
      if(key==38) { changeNumber(true); } // стрелка вверх
      if(key==40) { changeNumber(false); } // стрелка вниз
    });
  
    function changeNumber(operation) {
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

  }
})();









