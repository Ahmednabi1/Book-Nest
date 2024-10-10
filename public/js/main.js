$(document).ready(function(){
    $('.gallery-slider').slick({
      centerMode: true,
      centerPadding: '40px',
      slidesToShow: 3,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });
  });
  