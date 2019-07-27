let Player = new MidiPlayer.Player()

$(document).ready(function() {
  let playerDivs = Array.from(document.getElementsByClassName('player'))

  playerDivs.forEach((playerDiv, index) => {
    playerDiv.addEventListener('click', () => {
      Player.stop()
      if (!playerDiv.classList.contains('playing')) {
        play(`sample${index}.mid`)
        playerDivs.forEach((p) => {
          if (p.classList.contains('playing') && playerDiv !== p) {
            p.classList.remove('playing')
          }
        })
      }
      playerDiv.classList.toggle('playing')
    })
  })

})
  
function fetchMidiFile(fileName) {
  let blob = fetch('/samples/' + fileName).then(r => r.blob());
  return blob
}

function play(songName) {
  let ac = new AudioContext() || new webkitAudioContext()
  let file = null
  fetchMidiFile(songName).then(f => {
    file = f
    let reader = new FileReader()

    Soundfont.instrument(ac, 'acoustic_grand_piano').then((instrument) => {
      reader.readAsArrayBuffer(file)
      reader.addEventListener('load', () => {
        let localPlayer = new MidiPlayer.Player((event) => {
          instrument.play(event.noteName, ac.currentTime, { gain: event.velocity / 100 })
        })

        localPlayer.loadArrayBuffer(reader.result)
        Player = localPlayer.play()
        console.log(Player)
      })
    })
  })
}