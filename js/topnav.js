function nav_menu() {
  var x = document.getElementById('navbar')
  console.log('here')
  if (x.className === 'topnav') {
    //x.className += ' responsive';
    x.classList.add('responsive')
    console.log('r')
  } else {
    //x.className = 'topnav';
    x.classList.remove('responsive')
    console.log('x')
  }
}

  
jQuery(document).ready(function( $ ) {
	var mywindow = $(window);
	var mypos = mywindow.scrollTop();
	var up = false;
	var newscroll;
	mywindow.scroll(function () {
			newscroll = mywindow.scrollTop();
			if (newscroll > mypos && !up) {
					$('.topnav').stop().fadeOut();
					up = !up;
					console.log(up);
			} else if(newscroll < mypos && up) {
					$('.topnav').stop().fadeIn();
					up = !up;
			}
			mypos = newscroll;
  });
});