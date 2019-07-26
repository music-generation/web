let file, track = null
let fileName = null

$(document).ready(function() {
  file = new Midi.File()
  track = new Midi.Track()
  file.addTrack(track)

  let noteButtons = Array.from(document.getElementsByClassName('note-button'))
  let saveButton = document.querySelector('.save')

  let loader = document.querySelector('.loader')
  let placeholderText = document.querySelector('.placeholder-text')

  saveButton.addEventListener('click', function() {
    loader.classList.remove('disabled')
    saveButton.classList.toggle('disabled')
    placeholderText.style.visibility = "hidden"
    let notes = getSelectedNotes(noteButtons)

    notes.forEach(note => track.addChord(0, note, 128))

    fileName = generateName()
    console.log(`name: ${fileName}`)
    let uri = generateMidiURI(file)
    sendRequestToCreateFile(uri, fileName)

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

function sendRequestToCreateFile(midiUri, fileName) {
  let http = new XMLHttpRequest()
  http.open('POST', '/api', true)
  http.setRequestHeader('Content-Type', 'application/json');
  http.send(JSON.stringify({
    uri: midiUri,
    name: fileName
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

function generateName() {
  return Math.random().toString(36).substr(2)
}







