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
  })

})

function setupNoteButtons(buttons) {
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

// const bytes = file.toBytes();
// const b64 = btoa(bytes);
// const uri = 'data:audio/midi;base64,' + b64;
// const link=document.createElement('a');

// link.href=uri;
// link.download = 'music.mid';
// link.click(); // this will start a download of the MIDI byte string 