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

  
// jQuery(document).ready(function( $ ) {
// 	var mywindow = $(window);
// 	var mypos = mywindow.scrollTop();
// 	var up = false;
// 	var newscroll;
// 	mywindow.scroll(function () {
// 			newscroll = mywindow.scrollTop();
// 			if (newscroll > mypos && !up) {
// 					$('.topnav').stop().fadeOut();
// 					up = !up;
// 					console.log(up);
// 			} else if(newscroll < mypos && up) {
// 					$('.topnav').stop().fadeIn();
// 					up = !up;
// 			}
// 			mypos = newscroll;
//   });
// });

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}