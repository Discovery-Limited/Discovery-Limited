window.addEventListener("DOMContentLoaded", () => {
  const projects = document.querySelector("#projects");
  const details = document.querySelector("#project-details-popup");
 
  class Projects {
    constructor(data) {
      this.userID = data.user;
      this.projectID = data.project_id;
      this.projectName = data.project_name;
      this.contributorsCount = data.contributors;
      this.adminID = data.admin_id;
      this.admin = data.adminEmail;
      this.contributors = data.users;
      this.tasks = data.tasks;
      this.ownTasks = data.user_task_count;
      this.projectUsers = data.projectUsers;
      this.finishedTasks = 0;
      this.detailsBtn = null;
    }

    render() {
      const template = document.querySelector("template");
      const content = template.content.cloneNode(true);

      const node = content.querySelector(".project-item");
      node.setAttribute("data-project-id", this.projectID);

      const projectName = content.querySelector(".project-name");
      projectName.textContent = this.projectName;

      const projectContributors = content.querySelector(
        ".project-contributors"
      );
      projectContributors.innerHTML += this.contributorsCount;

      if (this.tasks.length > 0) {
        this.tasks.forEach((task) => {
          if (task.status === "done") {
            this.finishedTasks++;
          }
        });
      }

      const tasksDone = content.querySelector(".progress-text");
      tasksDone.textContent =
        this.finishedTasks + tasksDone.textContent + this.tasks.length;

      const taskBar = content.querySelector(".progress-child");
      taskBar.style.width = `${
        (this.finishedTasks / this.tasks.length) * 100
      }%`;

      this.node = document.importNode(content, true);

      this.detailsBtn = this.node.querySelector(".project-btn");

      projects.appendChild(this.node);
      this.detailsEvent();
    }

    detailsEvent() {
      this.detailsBtn.addEventListener(("click"), () => {
        const detailWrapper = details.querySelector("#project-details-wrapper");
        detailWrapper.querySelector("h2").textContent = this.projectName;
        detailWrapper.querySelector("#admin").textContent = "Admin: " + this.admin;
        const tasksDone = details.querySelector(".progress-text");
        tasksDone.textContent = this.finishedTasks + " tasks done out of " + this.tasks.length;
        details.setAttribute("data-id", this.projectID);
        details.setAttribute("data-count", this.contributorsCount);
        details.querySelector("#own-tasks").textContent = "Assigned Tasks: " + this.ownTasks;
        const userList = details.querySelector("#project-details-contributors");

        Array.from(userList.childNodes).forEach(child => {
          child.remove();
        });

        this.projectUsers.forEach((user) => {
          const anchor = document.createElement("a");
          anchor.textContent = user.email;
          userList.appendChild(anchor);
        });

        if (this.userID == this.adminID) {
          details.querySelector("#delete").classList.remove("hide");
          details.querySelector("#leave").classList.add("hide");
        } else {
          details.querySelector("#delete").classList.add("hide");
          details.querySelector("#leave").classList.remove("hide");
        }
        details.classList.remove("hide");
      });
    }
    
  }

  document.querySelector("#project-details-close").addEventListener(("click"), () => {
    details.classList.add("hide");
  });

  document.querySelector("#delete").addEventListener("click", function() {
    const projectId = details.getAttribute("data-id");
    if (projectId) {
      fetch("project_delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: projectId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const projectSelector = `[data-project-id="${projectId}"]`;
          const projectElem = document.querySelector(projectSelector);
          if (projectElem) {
            projectElem.remove();
          }
          details.classList.add("hide");
          omitData({ projectId: projectId });
        } else {
          console.error("Error deleting project:", data.error);
        }
      })
      .catch(error => {
        console.error("Error processing request:", error);
      });
    } else {
      console.error("Project ID not found on 'details' element.");
    }
  });

  document.querySelector("#leave").addEventListener(("click"), () => {
    const projectId = details.getAttribute("data-id");
    let contributorsCount = details.getAttribute("data-count");
    contributorsCount--;
    if (projectId) {
      fetch("project_leave.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_id: projectId, contributors: contributorsCount })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const projectSelector = `[data-project-id="${projectId}"]`;
          const projectElem = document.querySelector(projectSelector);
          if (projectElem) {
            projectElem.remove();
          }
          details.classList.add("hide");
          omitData({ projectId: projectId });
        } else {
          console.error("Error leaving project:", data.error);
        }
      })
      .catch(error => {
        console.error("Error processing request:", error);
      });
    } else {
      console.error("Project ID not found on 'details' element.");
    }
  })

  fetch("fetch_projects.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error:", data.error);
      } else {
        data.forEach((project) => {
          const projectInstance = new Projects(project);
          projectInstance.render();
        });
      }
    })
    .catch((error) => console.error("Error fetching projects:", error));
});

function omitData(data) {
  const data_to_send = { message: data };
  window.parent.postMessage(data_to_send, "*");
}

function togglePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}
