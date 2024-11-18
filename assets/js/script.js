const url = "https://api.flickr.com/services/rest?";
const key = "d12447f70e875413282a48b9cbe48257";

let imgdata = [];
let Search = "";

const searchInput = document.getElementById("search");
const imghtml = document.getElementById("img_list");
const load = document.getElementById("load");
document.getElementById("input").addEventListener("keyup", (e) => {
  Search = e.target.value;
  if (e.key === "Enter") {
    getImgs();
  }
});

function getIMG() {
  let htmlString = imgdata
    .map((data) => {
      if (data.url_h === undefined) {
        return "";
      }

      return `
         
            <div class="col-md-3">
                <div class="boxShadowClass">
                    <div class="img-block">
                        <img src="${data.url_h}" alt="" class="zoom">
                        <a data-href="${data.url_h}" onclick='forcedownload(this)'>
                            <span id="mdi"><svg id="svg" fill="white" width="34px" height="34px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>download</title> <path d="M18.313 13.625h-4.031v-6.594c0-0.563-0.469-1.031-1.031-1.031h-4.031c-0.594 0-1.063 0.469-1.063 1.031v6.594h-4.031c-0.531 0-0.719 0.344-0.313 0.75l6.688 6.656c0.188 0.188 0.438 0.281 0.719 0.281s0.563-0.094 0.75-0.281l6.656-6.656c0.375-0.406 0.25-0.75-0.313-0.75zM0 18.344v7.125c0 0.313 0.156 0.5 0.5 0.5h21.375c0.344 0 0.531-0.188 0.531-0.5v-7.125c0-0.313-0.25-0.531-0.531-0.531h-2.031c-0.281 0-0.531 0.25-0.531 0.531v4.531h-16.25v-4.531c0-0.313-0.219-0.531-0.5-0.531h-2.063c-0.281 0-0.5 0.25-0.5 0.531z"></path> </g></svg></span>
                        </a>
                    </div>
                </div>
            </div>
      `;
    })
    .join("");
  load.classList.add("d-none");

  imghtml.innerHTML = htmlString;

  if (htmlString === "") {
    document.getElementById("err").innerText = "No results Found for " + Search;
  }
}

function forcedownload(link) {
  var url = link.getAttribute("data-href");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement("a");
    tag.href = imageUrl;
    tag.download = link.id;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
    window.URL.revokeObjectURL(imageUrl);
  };
  xhr.send();
}

function getImgs() {
  try {
    if (Search === "") {
      document.getElementById("err").innerText = "Please Enter a valid input";
      document.getElementById("input").focus();
    } else {
      document.getElementById("err").innerText = "";

      load.classList.remove("d-none");
      console.log(Search);
      fetch(
        `${url}api_key=${key}&extras=url_h&format=json&method=flickr.photos.search&nojsoncallback=1&page=1&tags=${Search}`
      )
        .then((res) => res.json())
        .then((img) => {
          imgdata = img.photos.photo;

          getIMG();
        });
    }
  } catch (er) {
    console.log(er);
  }
}

function setTheme(theme) {
  document.documentElement.style.setProperty("--primary-color", theme);
  localStorage.setItem("cc-theme", theme);
}

setTheme(localStorage.getItem("cc-theme") || "#1A4B84");
