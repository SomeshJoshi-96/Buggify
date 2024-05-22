// script.js
//required variables
const itemsPerpage = 15;
var numberOfpages;
var activePage = 1;
const projectsContainer = document.getElementById("projectsContainer");
const addProjectmodal = document.getElementById("addProjectmodal");
const descriptionError = document.getElementById("descriptionError");
const nameError = document.getElementById("nameError");
const authorError = document.getElementById("authorError");
const authorFilterdropdown = document.getElementById("authorFilterdropdown");
const searchButton = document.getElementById("searchButton");
const searchBynameInput = document.getElementById("searchBynameInput");
const searchBydescriptionInput = document.getElementById(
  "searchBydescriptionInput"
);
const dropdownItems = document.getElementsByClassName("dropdown-item");
const filterValue = document.getElementById("filterValue");
const paginationUl = document.getElementById("paginationUl");
//function to retrieve the required projects from db
async function showProjects(
  pageNumber,
  author = "",
  description = "",
  name = ""
) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/project/getProjects?pageNumber=${pageNumber}&description=${description}&name=${name}&author=${author}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data);
    data.projects.forEach((project) => {
      const newProject = document.createElement("div");
      newProject.classList.add("newProject");
      newProject.innerHTML = `
      <div class= "fieldValue">
      <div class="field">Name: </div>
      <div class ="projectName">${project.name}</div>
      </div>
      <div class= "fieldValue">
      <div class="field">Desc: </div>
      <div class ="projectDescription">${project.description}</div> 
      </div>
      <div class= "fieldValue">
      <div class="field">Author: </div>
      <div class ="projectAuthor">${project.author}</div>
      </div>
      <div class = "projectId">${project._id}</div>
      <div class ="seeBugs"><i class="fa-solid fa-bug"></i></div>`;
      projectsContainer.appendChild(newProject);
    });
    activePage = pageNumber;
    numberOfpages = Math.ceil(data.totalCount / itemsPerpage);
    while (paginationUl.firstChild) {
      // Remove the first child element from the parent div
      paginationUl.removeChild(paginationUl.firstChild);
    }
    for (let i = 1; i <= numberOfpages; i++) {
      const pageli = document.createElement("li");
      pageli.classList.add("page-item");
      pageli.classList.add("page-link");
      pageli.innerText = i;

      if (i == activePage) {
        pageli.classList.add("activePagenumber");
        console.log(pageli);
      }
      paginationUl.appendChild(pageli);
    }
    console.log(numberOfpages);
    const pageItems = document.getElementsByClassName("page-item");
    Array.from(pageItems).forEach((pageItem) => {
      const pageNumber = pageItem.innerText;
      pageItem.addEventListener("click", () => {
        const name = searchBynameInput.value;
        const description = searchBydescriptionInput.value;
        const author = filterValue.innerText;
        console.log(name, description, author);
        while (projectsContainer.firstChild) {
          // Remove the first child element from the parent div
          projectsContainer.removeChild(projectsContainer.firstChild);
        }
        showProjects(pageNumber, author, description, name);
      });
    });
    //adding event listener to
    const seeBugs = document.getElementsByClassName("seeBugs");
    Array.from(seeBugs).forEach(function (element) {
      element.addEventListener("click", function () {
        const projectIdElement = findNearestPreviousSiblingWithClass(
          this,
          "projectId"
        );
        if (projectIdElement) {
          const projectId = projectIdElement.textContent;
          const url =
            "/api/bug/getBugs?projectId=" + encodeURIComponent(projectId);
          window.location.href = url;
        }
      });
    });
    function findNearestPreviousSiblingWithClass(element, className) {
      let siblingElement = element.previousElementSibling;
      while (siblingElement) {
        if (siblingElement.classList.contains(className)) {
          return siblingElement;
        }
        siblingElement = siblingElement.previousElementSibling;
      }
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//populate filter function
async function populateFilter() {
  try {
    const response = await fetch(
      `http://localhost:8000/api/project/getUniqueAuthors`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log(data);
    const newAuthor = document.createElement("li");
    newAuthor.classList.add("newAuthor");
    newAuthor.classList.add("dropdown-item");
    newAuthor.innerText = `None`;
    authorFilterdropdown.appendChild(newAuthor);
    data.forEach((author) => {
      console.log(author);
      const newAuthor = document.createElement("li");
      newAuthor.classList.add("newAuthor");
      newAuthor.classList.add("dropdown-item");
      newAuthor.innerText = `${author}`;
      authorFilterdropdown.appendChild(newAuthor);
    });
    //eventlistener for dropdownItems
    Array.from(dropdownItems).forEach((dropdownItem) => {
      if (dropdownItem.innerText == "None") {
        dropdownItem.addEventListener("click", () => {
          console.log(dropdownItem.innerText);
          filterValue.innerText = "";
        });
      } else {
        dropdownItem.addEventListener("click", () => {
          console.log(dropdownItem.innerText);
          filterValue.innerText = dropdownItem.innerText;
        });
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//after post request update filter
function checkForfilterUpdate(author) {
  const children = authorFilterdropdown.children;
  let includes = false;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.innerText.includes(author)) {
      includes = true;
      break;
    }
  }
  if (includes == false) {
    const newAuthor = document.createElement("li");
    newAuthor.classList.add("newAuthor");
    newAuthor.innerText = `${author}`;
    authorFilterdropdown.appendChild(newAuthor);
  }
}
//on first load show the first 9 projects
document.addEventListener("DOMContentLoaded", function () {
  const projectsContainer = document.getElementById("projectsContainer");
  showProjects(1);
  populateFilter();
});

//Add project form
const addProjectform = document.getElementById("addProjectform");
addProjectform.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    console.log(addProjectform);
    const formData = new URLSearchParams();
    addProjectform.querySelectorAll("input").forEach((input) => {
      formData.append(input.name, input.value);
    });
    const response = await fetch(addProjectform.action, {
      method: addProjectform.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage.errors);
      for (error of errorMessage.errors) {
        if (error.description) {
          console.log(error.description);
          descriptionError.innerText = error.description;
        }
        if (error.name) {
          console.log(error.name);
          nameError.innerText = error.name;
        }
        if (error.author) {
          console.log(error.author);
          authorError.innerText = error.author;
        }

        setTimeout(function () {
          descriptionError.innerText = "";
          nameError.innerText = "";
          authorError.innerText = "";
        }, 5000);
      }
      throw new Error("Incomplete Form");
    }

    // Handle successful response here
    console.log("Form submitted successfully");
    const newResponseproject = await response.json();
    console.log(newResponseproject.newProject.author);
    checkForfilterUpdate(newResponseproject.newProject.author);
    window.location.reload();
  } catch (error) {
    // Handle errors here
    console.error("Error submitting form", error);
  }
});

//searching or filterinf for projects
searchButton.addEventListener("click", () => {
  const name = searchBynameInput.value;
  const description = searchBydescriptionInput.value;
  const author = filterValue.innerText;
  console.log(name, description, author);
  while (projectsContainer.firstChild) {
    // Remove the first child element from the parent div
    projectsContainer.removeChild(projectsContainer.firstChild);
  }
  showProjects(1, author, description, name);
});
