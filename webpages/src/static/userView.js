document.addEventListener("DOMContentLoaded", function() {
  const profileDropdownButton = document.querySelector(".profile-dropdown-btn");
  const profileDropdownList = document.querySelector(".profile-dropdown-list");
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebarDropdownList = document.querySelector('.sidebar-dropdown-list');

  profileDropdownButton.addEventListener("click", function() {
    profileDropdownList.classList.toggle("active");
  });

  sidebarToggle.addEventListener("click", function() {
    sidebarDropdownList.classList.toggle("active");
  });

  window.addEventListener('click', function(e) {
    if (!profileDropdownButton.contains(e.target) && !profileDropdownList.contains(e.target) && profileDropdownList.classList.contains("active")) {
      profileDropdownList.classList.remove("active");
    }
  });

  window.loadContent = function(fileName) {
    document.getElementById("contentFrame").src = fileName;
  };
});
