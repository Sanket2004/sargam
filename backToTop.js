$(document).ready(function () {
    var $backToTopBtn = $("#backToTopBtn");
  
    // Show/hide the button based on the scroll position
    $(window).scroll(function () {
      if ($(this).scrollTop() > 20) {
        $backToTopBtn.addClass("show");
      } else {
        $backToTopBtn.removeClass("show");
      }
    });
  
    // Scroll to the top with smooth animation when the button is clicked
    $backToTopBtn.click(function () {
      $("html, body").animate({ scrollTop: 0 }, 500); // Adjust the duration (in milliseconds) as needed
      return false;
    });
  });
  