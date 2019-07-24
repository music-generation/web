  $(document).ready(function() {
    let controls = Array.from(document.getElementsByClassName('play-icon'))
    controls.forEach((button) => {
      button.addEventListener('click', () => {
        controls.forEach((control) => {
          if (control.classList.contains('pause') && control !== button) {
            control.classList.toggle('pause')
            control.classList.toggle('play')
          }
        })
        button.classList.toggle('pause')
        button.classList.toggle('play')
      })
    })  
  }) 