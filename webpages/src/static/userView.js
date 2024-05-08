document.addEventListener("DOMContentLoaded", function () {
  const profileDropdownButton = document.querySelector(".profile-dropdown-btn");
  const profileDropdownList = document.querySelector(".profile-dropdown-list");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarDropdownList = document.querySelector(".sidebar-dropdown-list");
  const createProject = document.querySelector("#create-project");
  const projectForm = document.querySelector("#project-form");
  const closeProjectPopup = document.querySelector(".close-popup");
  const projectButton = document.querySelector("#projects");

  fetch("fetch_projects.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((project) => {
        const li = document.createElement("li");
        const text = document.createElement("a");
        text.textContent = project.project_name;
        li.classList.add("project");
        li.setAttribute("data-id", project.project_id);
        li.appendChild(text);
        sidebarDropdownList.appendChild(li);

        li.addEventListener("click", () => {
          const projectId = li.getAttribute("data-id");
          setProjectIdInSession(projectId);
          
          projectButton.querySelector("p").textContent = li.querySelector("a").textContent;
          projectButton.setAttribute("data-id", projectId);
          projectButton.classList.toggle("active");
          
          sidebarToggle.querySelector("i").classList.toggle("fa-angle-down");
          sidebarToggle.querySelector("i").classList.toggle("fa-angle-up");
          sidebarDropdownList.classList.toggle("active");
          document.querySelector("#project-home").querySelector(".sidebar-toggle").classList.toggle("active");

          loadContent('./projects.html');
        });

        fetch("check_project_session.php")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.projectID) {
              const projectLi = document.querySelector(
                `.project[data-id="${data.projectID}"]`
              );
              if (projectLi) {
                projectButton.querySelector("p").textContent =
                projectLi.textContent.trim();
              } else {
                console.error("Project li not found for ID:", data.projectID);
              }
              return;
            } else {
              fetch("fetch_projects.php")
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((data) => {
                  const currentProject = data[0];

                  projectButton.querySelector("p").textContent =
                    currentProject.project_name;
                  projectButton.setAttribute(
                    "data-id",
                    currentProject.project_id
                  );
                  setProjectIdInSession(currentProject.project_id);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error checking project session:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    function setProjectIdInSession(projectId) {
    if (!projectId) {
      console.error("Project ID is not provided");
      return;
    }

    fetch("set_project_session.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectID: projectId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then()
      .catch((error) => {
        console.error("Error setting project ID in session:", error);
      });
  }

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
      const uniqueParam = Date.now();
      return `${fileName}?version=${uniqueParam}`;
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

  const sidebarToggles = document.querySelectorAll(".sidebar-toggle");

  sidebarToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      sidebarToggles.forEach((toggle) => {
        toggle.classList.remove("active");
      });

      toggle.classList.add("active");
    });
  });
  
  window.addEventListener("message", (event) => {
    // Check the origin for security reasons
    if (event.origin !== "https://discoveria.online") {
      console.error("Unauthorized attempt to communicate from:", event.origin);
      return;
    }
    
    // Handle the incoming data
    const data = event.data.message; 
  
    if (data.projectId) {
      const projectSelector = `.project[data-id="${data.projectId}"]`;
      const projectElement = document.querySelector(projectSelector);
      if (projectElement) {
        projectElement.remove();
        checkProjects();
      }
    }
  }, false);
  
  function checkProjects() {
    const projectButton = document.querySelector("#projects");
    fetch("fetch_projects.php")
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }
                    return response.json();
                  })
                  .then((data) => {
                    if (data[0]) {
                      const currentProject = data[0];
  
                      projectButton.querySelector("p").textContent =
                        currentProject.project_name;
                      projectButton.setAttribute(
                        "data-id",
                        currentProject.project_id
                      );
                      setProjectIdInSession(currentProject.project_id);
                    } else {
                      projectButton.querySelector("p").textContent = "Projects";
                      projectButton.setAttribute("data-id", undefined);
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
  }
});