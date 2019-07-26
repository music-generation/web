let file, track = null

$(document).ready(function() {
  file = new Midi.File()
  track = new Midi.Track()
  file.addTrack(track)

  let noteButtons = Array.from(document.getElementsByClassName('note-button'))
  let saveButton = document.querySelector('.save')

  saveButton.addEventListener('click', function() {

    let notes = getSelectedNotes(noteButtons)

    notes.forEach(note => track.addChord(0, note, 128))

    let uri = generateMidiURI(file)
    sendRequestToCreateFile(uri)

    // wait for generated midi file
    // receive generated midi file
    // save the file
  }) 

})

function generateMidiURI(input) {
  const bytes = input.toBytes()
  const b64 = btoa(bytes)
  const uri = 'data:audio/midi;base64,' + b64
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

function isSelected(button) {
  return button.classList.contains('selected')
}

// returns 2d array of selected notes
function getSelectedNotes(buttonList) {
  let notesAll = []
  for (let i = 0; i < 8; i++) {
    let slice = buttonList.slice(8 * i, 8 * (i + 1))
    let notesPart = slice.filter(isSelected).map(el => el.name)
    notesAll.push(notesPart)
  }
  return notesAll
}










