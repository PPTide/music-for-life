let message = null;
const split = "&|&";

// Websocket und File System initialisieren
const WebSocket = require('ws');
fs = require('fs');

// Daten fürs Speichern aufbereiten
function setContent(name, group, content, data) {
  // groupIndex initialisieren
  let groupIndex = null;
  // data parsen, also aus einem String eine JSON Variable machen. 
  let parsedData = JSON.parse(data);

  // Sucht den Index der Gruppe, damit es in der JSON Datei richtig eingeordnet werden kann. 
  // Dazu geht es durch jede Gruppe
  for (var i = parsedData.length - 1; i >= 0; i--) {
    // und guckt, ob der Name group entspricht, 
    if (String(parsedData[i].name) == String(group)) {
      // wenn dem so ist wird groupIndex auf den Aktuellen Index(i) gesetzt. 
      groupIndex = i;
    } 
  }

  //Wenn eine Gruppe erkannt wurde, 
  if (groupIndex != null) {
    // wird ein neuer Abschnitt zum groupIndex'ten Teil von parsedData hinzugefügt
    parsedData[groupIndex].content.push(JSON.parse('{"name":"'+ name +'", "content":"'+ content +'"}'));
    // dann wird parsedData zu einem String gemacht
    let toSave = JSON.stringify(parsedData);

    // und gespeichert
    saveData(toSave);
  } else {
    // wenn die Gruppe nicht erkannt wird gibt der Code einen Fehler
    console.error("Gruppe nicht erkannt.");
  }
}

// Speichert die Daten in die forum.json Datei mithilfe von fs
function saveData(data) {
  console.log('saving: %s', data);
  data = String(data);
  fs.writeFile('../data/forum.json', data, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('Saved!');
    }
  }); 
}

// Kopiert von Stackoverflow (und bearbeitet)
// Neuen Server aufsetzen/einrichten
const wss = new WebSocket.Server({ port: 7273 });

// Wenn eine Verbindung eingerichtet wird
wss.on('connection', function connection(ws) {

  // wenn eine Nachricht empfangen wird
  ws.on('message', function incoming(message) {
    // wird die Nachricht Ausgegeben und "gelesen"
    console.log('received: %s', message);
    read(message);
  });

  // es wird auf die Nachricht reagiert
  function react(msg, data) {
    // erst wird die Nachricht auseinandergenommen
    message = msg.split(split);
    // dann wird geguckt, ob der Forumsinhalt angefordert wird 
    // oder etwas hinzugefügt werden soll
    if (String(message[0]) == "GET") { // anfordern
      // es wird data (welche aus der Datei gelesen wurde)
      ws.send(String(data));
    } else if (String(message[0]) == "ADD") { // hinzufügen
      // sonst wird die setContent Funktion aufgerufen
      setContent(message[1], message[2], message[3], data);
    } else {
      console.error("Illegal Message Type");
    }
  }

  // Die Nachricht wird "gelesen"/verstanden
  function read(msg) {
    // es wird mit fs die Datei forum.json gelesen
    fs.readFile('../data/forum.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      // und es wird auf die Nachricht reagiert
      react(msg, data);
    });
  }
});
