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

  let demoGeneratedPlayer = document.querySelector('.demo-generated-player')
  let demoInputPlayer = document.querySelector('.demo-input-player')

  saveButton.addEventListener('click', function() {
    loader.classList.toggle('disabled')
    saveButton.classList.toggle('disabled')
    placeholderText.style.visibility = "hidden"

    let notes = getSelectedNotes(noteButtons)

    notes.forEach(note => track.addChord(0, note, 64))

    fileName = generateName()
    console.log(`name: ${fileName}.mid`)

    let midiEncoding = generateMidiEncoding(file)

    // music generation request

    $.ajax({
      type: 'POST',
      url: '/generate',
      data: JSON.stringify({
        uri: midiEncoding,
        name: fileName
      }),
      dataType: 'json',
      success: function(result) {
        loader.classList.toggle('disabled')
        demoGeneratedPlayer.style.visibility = 'visible'
        demoInputPlayer.style.visibility = 'visible'

        demoGeneratedPlayer.addEventListener('click', function() {
          Player.stop()
          // play(`out_${fileName}.mid`)
          play('sample1.mid')
        })

        demoInputPlayer.addEventListener('click', function() {
          Player.stop()
          // play(`${fileName}.mid`)
          play('sample0.mid')
        })
      }
    })

    // generateMelodyFromMidi(midiEncoding, fileName)
  }) 

})

function generateMidiEncoding(input) {
  const bytes = input.toBytes()
  const b64 = btoa(bytes)
  console.log(b64)
  return b64
}

function generateMelodyFromMidi(midiUri, fileName) {
  let http = new XMLHttpRequest()
  http.open('POST', '/generate', false)
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

