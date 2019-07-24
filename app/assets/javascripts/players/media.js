$(document).ready(function() {
  let players = Array.from(document.getElementsByClassName('player'))

  players.forEach((player) => {
    player.addEventListener('click', function() {
      let file = fetchMidiFile('mario.mid')
      if (file) {
        console.log('Received file')
        console.log(file)
      } else {
        console.log('Did not receive file.')
      }
    })
  })
})

function fetchMidiFile(fileName) {
  const http = new XMLHttpRequest()
  const url = "https://s3.us-south.cloud-object-storage.appdomain.cloud/music-gen-dev/" + fileName
  http.open('GET', url) 
  http.send()

  http.onreadystatechange = (e) => {
    if (this.readyState == 4 && this.status == 200) {
      return http.response.body  
    } 
  }
}

// https://s3.us-south.cloud-object-storage.appdomain.cloud/music-gen-dev/<fileName>