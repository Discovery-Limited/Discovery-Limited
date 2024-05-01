window.addEventListener("load", () => {
    const listCon = document.querySelector("ul");
    
    class Projects {
        static editBtns = [];
        static projectsList = [];

        constructor(projectName, contributorsCount) {
            this.projectName = projectName;
            this.contributorsCount = contributorsCount;
            this.node = null;
            this.editBtn = null;
            this.dropdownContent = null;
            this.editMode = false;
        }
    
        render() {
            const template = document.querySelector('template');
            const content = template.content.cloneNode(true);
            
            content.querySelector('p').textContent = this.projectName;
            content.querySelectorAll('.contributors p')[0].textContent = this.contributorsCount;
            
            this.node = document.importNode(content, true);
            this.editBtn = this.node.querySelector('.edit-btn');
            this.dropdownContent = this.node.querySelector(".edit-dropdown");
            
            Projects.editBtns.push(this.editBtn);
            Projects.projectsList.push(this)
            listCon.appendChild(this.node);
            this.toggleEvent();
        }
        
        toggleEvent() {
            this.editBtn.addEventListener("click", () => this.handleToggle());
        }

        handleToggle() {
            if (!this.editMode) {
                this.editBtn.style.display = "none";
                this.dropdownContent.style.display = "grid";
                this.editMode = true;
            } else {
                this.editBtn.style.display = "var(--fa-display, inline-block)";
                this.dropdownContent.style.display = "none";
                this.editMode = false;
            }
        }
    }

    // for (let i = 0; i < 5; i++) {
    //     const project = new Projects('New Project', 5);
    //     project.render();
    // }

    window.addEventListener("click", (event) => {
       if (!event.target.classList.contains("edit-btn")) {
            Projects.projectsList.forEach(project => {
                if (project.editMode) {
                    project.handleToggle();
                };
            });
        }
    });   
});