// Aktiviert Bootstrap-Tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('.toast').toast("show");
})

// wählt das passende Feld aus
function select(id) {
  $(".selected").removeClass("selected").addClass("underListItem"); // gibt dem richtigen Element die selected Klasse
  $("#"+id).removeClass("underListItem").addClass("selected");

  $("#podcastName").text($("#"+id+" > p").text()); // Passt den Podcast Namen an
  $("#podcastNumber").text("#"+id); // Passt die Podcast Nummer an

  scroll(0, 0); // Go to Top
}

//Get the button:
mybutton = $("#toTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.show();
  } else {
    mybutton.hide();
  }
}

mybutton.click( function() {
  scroll(0, 0);
});