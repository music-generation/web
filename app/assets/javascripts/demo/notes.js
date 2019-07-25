$(document).ready(function() {
  let noteButtons = Array.from(document.getElementsByClassName('note-button'))

  noteButtons.forEach(button => {
    button.addEventListener('click', function() {
      button.classList.toggle('selected')
    })
  })
})