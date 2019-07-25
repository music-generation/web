let file, track = null

$(document).ready(function() {
  file = new Midi.File()
  track = new Midi.Track()
  file.addTrack(track)

  let noteButtons = Array.from(document.getElementsByClassName('note'))
  let saveButton = document.querySelector('.save')

  setupNoteButtons(noteButtons)

  saveButton.addEventListener('click', function() {
    let uri = generateMidiURI(file)
    sendRequestToCreateFile(uri)

    // wait for generated midi file
    // receive generated midi file
    // save the file
  }) 

})

function setupNoteButtons(buttons) {
  let 
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      let note = button.name
      track.addNote(0, note, 64)
    })
  })
}

function generateMidiURI(input) {
  const bytes = input.toBytes()
  const b64 = btoa(bytes)
  const uri = 'data:audio/midi;base64,' + b64
  console.log(uri)
  return uri
}

function sendRequestToCreateFile(midiUri) {
  let http = new XMLHttpRequest()
  http.open('POST', '/api', true)
  http.setRequestHeader('Content-Type', 'application/json');
  http.send(JSON.stringify({
    uri: midiUri
  }))
} 