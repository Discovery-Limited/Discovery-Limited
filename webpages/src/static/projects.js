window.addEventListener("DOMContentLoaded", () => {
  const projects = document.querySelector("#projects");

  class Projects {
    constructor(data) {
      this.projectID = data.project_id;
      this.projectName = data.project_name;
      this.contributorsCount = data.contributors;
      this.tasks = data.tasks;
      this.finishedTasks = 0;
      this.node = null;
      this.linkBtn = null;
    }

    render() {
      const template = document.querySelector("template");
      const content = template.content.cloneNode(true);

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

      this.linkBtn = this.node.querySelector(".project-btn");

      projects.appendChild(this.node);
      this.uploadProject();
    }

    uploadProject() {
      this.linkBtn.addEventListener("click", () => {});
    }
  }

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
