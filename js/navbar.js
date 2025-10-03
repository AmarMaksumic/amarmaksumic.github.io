function nav_menu() {
  var x = document.getElementById('navbar')
  if (x.classList.contains('responsive')) {
    x.classList.remove('responsive')
  } else {
    x.classList.add('responsive')
  }
}

// Modern scroll detection for navbar
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Add scrolled class when scrolling
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Close mobile menu when scrolling
  if (navbar.classList.contains('responsive')) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      navbar.classList.remove('responsive');
    }, 150);
  }
  
  lastScrollTop = scrollTop;
});

async function switchTab (switchTo) {
  console.log(switchTo)
  for (let i = 1; i < 5; i++) {
    document.getElementById('tab_' + i).classList.remove('active')
  }
  
  document.getElementById('page_stripe').style.right = null;
  document.getElementById('page_stripe').style.left = '0px';
  
  $('#page_cont').animate({'zoom': 0.5, width: '50%'}, 400, 'swing', function(){

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    $('#page_stripe').animate({width: '100%'}, 600, 'swing', function(){

      switch(switchTo) {
        case 1:
          if (window.matchMedia("(max-width: 1000px)").matches) $('#cont').load('html/m_home.html')
          else $('#cont').load('html/home.html')
          break;
        case 2:
          $('#cont').load('html/education.html')
          break;
        case 3:
          $('#cont').load('html/experience.html')
          break;
        case 4:
          $('#cont').load('html/projects.html')
          break;
        case 5:
          $('#cont').load('html/about.html')
          break;
        default:
          if (window.matchMedia("(max-width: 1000px)").matches) $('#cont').load('html/m_home.html')
          else $('#cont').load('html/home.html')
      }

      document.getElementById('page_stripe').style.right = '0px';
      document.getElementById('page_stripe').style.left = null;
    
      $('#page_stripe').animate({width: '0%'}, 600, 'swing', function(){

        $('#page_cont').animate({'zoom': 1, width: '100%'}, 400, 'swing');

      });
    });
  });

  

  document.getElementById('tab_' + switchTo).classList.add('active')
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
  document.getElementById('myBar').style.width = scrolled + '%';
}