document.addEventListener("DOMContentLoaded", function () {
  const profileDropdownButton = document.querySelector(".profile-dropdown-btn");
  const profileDropdownList = document.querySelector(".profile-dropdown-list");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarDropdownList = document.querySelector(".sidebar-dropdown-list");
  const createProject = document.querySelector("#create-project");
  const projectForm = document.querySelector("#project-form");
  const closeProjectPopup = document.querySelector(".close-popup");

  profileDropdownButton.addEventListener("click", function () {
    profileDropdownList.classList.toggle("active");
  });

  sidebarToggle.addEventListener("click", function () {
    sidebarToggle.querySelector("i").classList.toggle("fa-angle-down");
    sidebarToggle.querySelector("i").classList.toggle("fa-angle-up");
    sidebarDropdownList.classList.toggle("active");
  });

  window.addEventListener("click", function (e) {
    if (
      !profileDropdownButton.contains(e.target) &&
      !profileDropdownList.contains(e.target) &&
      profileDropdownList.classList.contains("active")
    ) {
      profileDropdownList.classList.remove("active");
    }
  });

  window.loadContent = function (fileName) {
    if (fileName !== document.getElementById("contentFrame")) {
      document.getElementById("contentFrame").src = fileName;
    }
  };

  createProject.addEventListener("click", function () {
    projectForm.classList.toggle("active");
  });

  closeProjectPopup.addEventListener("click", function () {
    projectForm.classList.toggle("active");
  });

  const emailInput = document.getElementById("emailInput");
  emailInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const email = this.value.trim();
      if (email && validateEmail(email)) {
        addEmailToList(email);
        this.value = "";
      } else {
        alert("Please enter a valid email.");
      }
    }
  });

  function addEmailToList(email) {
    const emailListDiv = document.getElementById("emailList");
    const newEmail = document.createElement("span");
    newEmail.textContent = email;
    emailListDiv.appendChild(newEmail);

    const hiddenEmails = document.getElementById("hiddenEmails");
    hiddenEmails.value += email + ",";
  }

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function loadWelcomePage() {
    const iframe = document.getElementById("contentFrame");
    iframe.src = "projects.html";
  }

  window.onload = loadWelcomePage;
});

document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggles = document.querySelectorAll(".sidebar-toggle");

  sidebarToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      sidebarToggles.forEach((toggle) => {
        toggle.classList.remove("active");
      });

      toggle.classList.add("active");
    });
  });
});
