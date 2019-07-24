$(document).ready(function() {
  let playerDivs = Array.from(document.getElementsByClassName('player'))
  let controls = Array.from(document.getElementsByClassName('play-icon'))
  playerDivs.forEach((playerDiv) => {
    playerDiv.addEventListener('click', () => {
      let clickedButton = playerDiv.childNodes[3]
      controls.forEach((control) => {
        if (control.classList.contains('pause') && control !== clickedButton) {
          togglePlayPause(control)
        }
      })
      togglePlayPause(clickedButton)
    })
  })
}) 

function togglePlayPause(element) {
  element.classList.toggle('play')
  element.classList.toggle('pause')
}