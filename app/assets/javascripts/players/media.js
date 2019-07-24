$(document).ready(function() {
  let players = Array.from(document.getElementsByClassName('player'))

  players.forEach((player, index) => {
    player.addEventListener('click', function() {
      play(`sample${index}.mid`)
    })
  })
})

async function fetchMidiFile(fileName) {
  let blob = fetch('/samples/' + fileName).then(r => r.blob());
  return blob
}

function play(songName) {
  let ac = new AudioContext()
  let file = null
  fetchMidiFile(songName).then(f => {
    file = f
    let reader = new FileReader()

    Soundfont.instrument(ac, 'acoustic_grand_piano').then((instrument) => {
      reader.readAsArrayBuffer(file)
      reader.addEventListener('load', () => {
        Player = new MidiPlayer.Player((event) => {
          instrument.play(event.noteName, ac.currentTime, { gain: event.velocity / 100 })
        })

        Player.loadArrayBuffer(reader.result)
        Player.play()
      })
    })
  })
}