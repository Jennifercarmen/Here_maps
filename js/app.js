  // Collapse Navbar
  const navbarCollapse = function() {
   if ($("#prie").offset().top > 100) {
    //  $("#header-main").addClass("navfixed"); 
     alert("hola");
   } else {
     $("#header-main").removeClass("navbar-shrink"); 
   }
 };
 // Collapse now if page is not at top
 navbarCollapse();
 // Collapse the navbar when page is scrolled
 $(window).scroll(navbarCollapse);
 
 
