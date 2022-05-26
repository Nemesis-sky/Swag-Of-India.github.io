// image gallery code
var img = document.getElementById("gallery-image").getElementsByTagName("img");
var images = Array.from(img);
for (i = 0; i < images.length; i++) {
    var show = images[i];
    show.onclick = function change() {
        document.getElementById("show-gal").setAttribute("src", this.src);
    }
}
// go to comment section in 0.3 sec
var goto_comment = document.getElementById("rating");
goto_comment.onclick = function reachComment() {
    document.getElementById("comment").scrollIntoView();
}


