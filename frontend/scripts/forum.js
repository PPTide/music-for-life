let myData = null;
let firstCall = true;
const ip = "pptie.de:8020/ws";
const split = "&|&";

// Funktion zum Öffnen eines webSockets, der den aktuellen Status von "forum.json" erfragt und in die Variable myData Speichert. 
function requestData(ip) {
  // webSocket verbinden
  const socket = new WebSocket('ws://' + ip);

  // webSocket öffnen und "GET" senden
  socket.addEventListener('open', function (event) {
    socket.send('GET');
  });

  // auf Nachrichten auf dem webSocket hören und diese in myData speichern
  socket.addEventListener('message', function (event) {
    console.log(event.data);
    myData = JSON.parse(event.data);
    loadData();
    if(firstCall==true){
      ready();
      firstCall=false;
    }
  });
}

// Funktion zum Öffnen eines webSockets, der den aktuellen Status von myData sendet, damit dies in "forum.json gespeichert wird.
function sendData(ip, content) {
  // webSocket verbinden
  const socket = new WebSocket('ws://' + ip);

  // webSocket öffnen und myData senden.
  socket.addEventListener('open', function (event) {
    socket.send(content);
  });

  // auf Nachrichten auf dem webSocket hören und in der Konsole debuggen
  socket.addEventListener('message', function (event) {
    console.debug(event.data);
  });
}

// Funktion zum Laden von myData auf die Website/in die HTML
function loadData() {
  console.debug(myData);

  // Leert den Container, in dem das Forum ist
  $("#forumContainer").empty();

  let HTML = null;
  let content = null;

  // geht durch jede Überschrift und fügt einen "card-header" hinzu, bei dem der Inhalt die Überschrift/der Name des Abschnitts ist
  for (var i = myData.length - 1; i >= 0; i--) {
    // nutz für den Namen ein 5.klassige Überschrift und die Bootstrap Klasse "card-header"
    // der Inhalt ist der aus der JSON Datei gelesene Name für i
    let name = "<h5 class='card-header'>"+myData[i].name+"</h5>";

    // nutzt für den Inhalt eine "unorderd list"(<ul>), der die Bootstrap Klassen "list-group" und "list-group-flush" zugewiesen bekommt
    // der Liste wird zudem Temporär die ID tempContent zugewiesen, damit sie später gefunden werden kann
    content = "<ul class='list-group list-group-flush' id='tempContent'></ul>"

    // zusammenfügen und an den forumContainer anhängen. 
    HTML = name + content;
    $("#forumContainer").prepend(HTML);
    

    // setzt content zu dem Inhalt des Abschnitts
    content = myData[i].content;

    // Geht durch jeden Beitrag.
    for (var j = content.length - 1; j >= 0; j--) {
      //console.log(content[j]);

      // gibt dem Listenelememt (<li>) die Bootstrap Klasse "list-group-item"
      let design = "class='list-group-item'";

      // lässt das Listenelememt beim anklicken die Funktion setModal() mit den "Koordinaten" für den Aktuellen Beitrag. 
      let script = "onclick='setModal("+i+","+j+");'";

      // öffnet beim anklicken das Modal mit der ID readModal
      let bootstrapScript = "data-toggle='modal' data-target='#readModal'";

      // zusammenfügen und an die Liste anhängen.
      HTML = "<li " + design + script + bootstrapScript + ">" + content[j].name + "</li>";
      $("#tempContent").prepend(HTML);
    }

    // entfernt die ID von der Liste, damit sie wieder "frei" für den nächsten Durchlauf ist
    $("#tempContent").attr("id", "");
  }
}

function setModal(categorie, index) {
  const state = {'categorie': categorie, 'index': index};
  const title = '';
  const url = 'forum.html?categorie='+categorie+'&index='+index;
  history.pushState(state, title, url)
  // sucht mit Hilfe, der "Koordinaten" den Namen und Inhalt
  var name = myData[categorie].content[index].name;
  var body = myData[categorie].content[index].content;

  // setzt den/das Namen/Titel/Label und den Inhalt/Body des "readModals" mithilfe von ID's
  $("#readModalLabel").html(name);
  $("#readModalBody").html(body);
  
  // fordert die Daten neu an, was für eine Aktualisierung sorgt
  requestData(ip);
}

function saveData() {
  // Übernimmt die Werte der Eingabefelder in Variablen
  let title = $("#titleInput").val(); 
  let group = $("#groupSelector").val(); 
  let content = $("#inhaltsInput").val();

  // und sende diese dann mit dem Identifikator "ADD" und mit &|& getrennt zum Server
  sendData(ip, "ADD" + split + title + split + group + split + content);

  // danach wartet er eine Sekunde und fordert ein Update der Daten an
  setTimeout(function(){
    requestData(ip);
  }, 1000);
}

function ready() {
  var url_string = window.location.href;
  var url = new URL(url_string);
  var categorie = url.searchParams.get("categorie");
  var index = url.searchParams.get("index");
  
  if(categorie != null && index != null) {
    setModal(categorie, index);
    $('#readModal').modal('show');
    console.log("JA!!!" + categorie + index);
  } else {
    console.log("Nein");
  }
}

requestData(ip);


// Aktualistiert das WriteModal, wenn es geöffnet wird
$('#writeModal').on('shown.bs.modal', function (e) {
  $("#groupSelector").empty();
  for (var i = myData.length - 1; i >= 0; i--) {
    $("#groupSelector").prepend('<option value="' + myData[i].name + '">' + myData[i].name + '</option>');
  }
})
