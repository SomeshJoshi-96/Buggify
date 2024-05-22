//important variables
const table = document.getElementById("bugTable");
const rows = table.getElementsByTagName("tr");
const titleError = document.getElementById("titleError");
const descriptionError = document.getElementById("descriptionError");
const authorError = document.getElementById("authorError");
const labelsError = document.getElementById("labelsError");
const goHomepageButton = document.getElementById("goHomepageButton");
//function to extract unique labels
function getUniqueLabelValues(columnIndex) {
  const uniqueValues = new Set();

  for (let i = 1; i < rows.length; i++) {
    const cell = rows[i].getElementsByTagName("td")[columnIndex];
    const cellValues = cell.textContent
      .trim()
      .split(",")
      .map((value) => value.trim().replace(/"/g, ""));
    cellValues.forEach((value) => uniqueValues.add(value));
  }

  return Array.from(uniqueValues);
}

const uniqueLabels = getUniqueLabelValues(3);
console.log(uniqueLabels);

//function to display labels dropdown
function showDropdown() {
  const input = document.getElementById("labels");
  const inputValues = input.value
    .toLowerCase()
    .split(",")
    .map((label) => label.trim());
  const dropdown = document.getElementById("labelDropdown");

  dropdown.innerHTML = "";

  // Filter labels based on input values
  const matchingLabels = uniqueLabels.filter((label) => {
    return inputValues.every((inputValue) =>
      label.toLowerCase().includes(inputValue)
    );
  });

  // Populate dropdown with matching labels
  if (matchingLabels.length > 0) {
    dropdown.style.display = "block";
    matchingLabels.forEach((label) => {
      const option = document.createElement("div");
      option.classList.add("option");
      option.textContent = label;
      option.addEventListener("click", () => {
        //   input.value = inputValues.length > 0 ? inputValues.join(', ') + ', ' + label : label;
        dropdown.style.display = "none";
        input.value = "";
        addLabel(option.textContent);
      });
      dropdown.appendChild(option);
    });
  } else {
    dropdown.style.display = "none";
  }
}

//function to display selected label
function addLabel(label) {
  const addedLabelsContainer = document.getElementById("addedLabels");
  const addedLabel = document.createElement("div");
  addedLabel.classList.add("addedLabel");
  addedLabel.innerHTML = `<div class=optionText>${label}</div>
  <div class=removeLabel> <i class="fa-solid fa-xmark"></i></i></div>
  `;
  addedLabelsContainer.appendChild(addedLabel);

  const removeLabels = document.getElementsByClassName("removeLabel");
  Array.from(removeLabels).forEach((element) => {
    element.addEventListener("click", () => {
      console.log("remove label clicked");
      const parentDiv = element.parentNode;
      parentDiv.parentNode.removeChild(parentDiv);
    });
  });
}

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
  const dropdown = document.getElementById("labelDropdown");
  if (
    !event.target.matches("#labels") &&
    !event.target.matches("#labelDropdown")
  ) {
    dropdown.style.display = "none";
  }
});

//event listener to attach label
const attachLabel = document.getElementById("attachLabel");
attachLabel.addEventListener("click", (event) => {
  event.preventDefault();
  const labelInput = document.getElementById("labels");
  const labelValue = labelInput.value;
  if (labelValue) {
    addLabel(labelValue);
  }
  labelInput.value = "";
});

//event listener when add a new bug button is clicked
const addBugform = document.getElementById("addBugform");
addBugform.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    // Get the current URL
    const currentUrl = window.location.href;
    const queryParams = new URLSearchParams(currentUrl.split("?")[1]);
    const projectId = queryParams.get("projectId");
    const addedLabelsContainer = document.getElementById("addedLabels");
    const optionTextElements =
      addedLabelsContainer.querySelectorAll(".optionText");
    const optionTextArray = [];

    optionTextElements.forEach((element) => {
      optionTextArray.push(element.textContent);
    });

    console.log(optionTextArray);
    console.log(projectId);
    console.log(addBugform);
    const formData = new URLSearchParams();
    addBugform.querySelectorAll("input").forEach((input) => {
      if (input.name != "labels") {
        formData.append(input.name, input.value);
      }
    });

    formData.append("labels", optionTextArray);
    const actionUrl = new URL(addBugform.action);
    actionUrl.searchParams.append("projectId", projectId);
    console.log(formData);

    const response = await fetch(actionUrl.toString(), {
      method: addBugform.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.log(errorMessage.errors);
      for (error of errorMessage.errors) {
        if (error.description) {
          console.log(error.description);
          descriptionError.innerText = error.description;
        }
        if (error.title) {
          console.log(error.name);
          titleError.innerText = error.title;
        }
        if (error.author) {
          console.log(error.author);
          authorError.innerText = error.author;
        }
        if (error.labels) {
          console.log(error.labels);
          labelsError.innerText = error.labels;
        }

        setTimeout(function () {
          descriptionError.innerText = "";
          titleError.innerText = "";
          authorError.innerText = "";
          labelsError.innerText = "";
        }, 5000);
      }
      throw new Error("Incomplete Form");
    }

    // Handle successful response here
    console.log("Form submitted successfully");
    const newResponsebug = await response.json();
    console.log(newResponsebug);
    window.location.reload();
  } catch (error) {
    // Handle errors here
    console.error("Error submitting form", error);
  }
});

//go to Homepage event listener

goHomepageButton.addEventListener("click", () => {
  window.location.href = "/api/project/";
});
