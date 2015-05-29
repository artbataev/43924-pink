(function() {
  if(!("FormData" in window)) {
    return;
  }

  var form = document.querySelector(".js-contest-form");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    var data = new FormData(form);
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
    });

    function preview(file) {
      if (file.type.match(/image.*/)) {
        var reader = new FileReader();

        reader.addEventListener("load", function(event) {
          var container = document.createElement("div");
          container.classList.add("user-photo");

          var img = document.createElement("img");
          img.src = event.target.result; 
          img.alt = file.name;

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