document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const charactersLink = document.getElementById("characters-link");
  const planetsLink = document.getElementById("planets-link");
  const vehiclesLink = document.getElementById("vehicles-link");

  charactersLink.addEventListener("click", () => loadEntities("people"));
  planetsLink.addEventListener("click", () => loadEntities("planets"));
  vehiclesLink.addEventListener("click", () => loadEntities("vehicles"));

  const loadEntities = (entityType, page = 1) => {
    fetch(`https://swapi.dev/api/${entityType}/?page=${page}`)
      .then((response) => response.json())
      .then((data) =>
        displayList(data.results, entityType, data.next, data.previous),
      )
      .catch((error) => console.error("Error fetching entities:", error));
  };

  const displayList = (entities, entityType, nextPage, prevPage) => {
    content.innerHTML = `<ul class="list-group">${entities
      .map(
        (entity, index) =>
          `<li class="list-group-item" data-index="${index}" data-type="${entityType}">${entity.name}</li>`,
      )
      .join("")}</ul>`;

    content.innerHTML += `
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          ${
            prevPage
              ? `<li class="page-item"><a class="page-link" href="#" id="prev-page">Previous</a></li>`
              : ""
          }
          ${
            nextPage
              ? `<li class="page-item"><a class="page-link" href="#" id="next-page">Next</a></li>`
              : ""
          }
        </ul>
      </nav>
    `;

    if (nextPage) {
      document
        .getElementById("next-page")
        .addEventListener("click", () =>
          loadEntities(entityType, getPageNumber(nextPage)),
        );
    }
    if (prevPage) {
      document
        .getElementById("prev-page")
        .addEventListener("click", () =>
          loadEntities(entityType, getPageNumber(prevPage)),
        );
    }
  };

  const getPageNumber = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("page");
  };

  content.addEventListener("click", (event) => {
    if (event.target.classList.contains("list-group-item")) {
      loadDetails(event.target.dataset.type, event.target.dataset.index);
    }
  });

  const loadDetails = (entityType, index) => {
    fetch(`https://swapi.dev/api/${entityType}/`)
      .then((response) => response.json())
      .then((data) => {
        const entity = data.results[index];
        displayDetails(entity);
      })
      .catch((error) => console.error("Error fetching details:", error));
  };

  const displayDetails = (entity) => {
    content.innerHTML = `<div class="card">
      <div class="card-body">
        <h5 class="card-title">${entity.name}</h5>
        <p class="card-text">${Object.entries(entity)
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join("<br>")}</p>
      </div>
    </div>`;
  };
});
