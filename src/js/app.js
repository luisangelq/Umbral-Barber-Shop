let page = 1;

document.addEventListener("DOMContentLoaded", () => {
  startApp();

  //hightlight Current Div
  showSection();

  //hide or show section
  changeSection();

  previousPage();

  nextPage();
});

const showSection = () => {
  const currentSection = document.querySelector(`#step-${page}`);
  currentSection.classList.add("show-section");

  //Highlight
  const tab = document.querySelector(`[data-step="${page}"]`);
  tab.classList.add("current");
};

const changeSection = () => {
  const links = document.querySelectorAll(".tabs button");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      page = Number(e.target.dataset.step);

      //delete previous section
      document.querySelector(".show-section").classList.remove("show-section");

      //add class where we hit click
      const section = document.querySelector(`#step-${page}`);
      section.classList.add("show-section");

      //same process
      document.querySelector(".current").classList.remove("current");
      const nav = document.querySelector(`[data-step="${page}"]`);
      nav.classList.add("current");

      console.log(section);
    });
  });
};

const startApp = () => {
  showServices();
};

const showServices = async () => {
  try {
    const result = await fetch("./services.json");
    const db = await result.json();

    const { services } = db;

    //generate html
    services.map((service) => {
      const { id, name, price } = service;

      //DOM Scripting
      const serviceName = document.createElement("P");
      serviceName.textContent = name;
      serviceName.classList.add("service-name");

      const servicePrice = document.createElement("P");
      servicePrice.textContent = `$${price}`;
      servicePrice.classList.add("service-price");

      const serviceDiv = document.createElement("DIV");
      serviceDiv.classList.add("service");
      serviceDiv.dataset.id = id;

      //Select a Div
      serviceDiv.onclick = selectService;

      //inyectar precio y nombre al div
      serviceDiv.appendChild(serviceName);
      serviceDiv.appendChild(servicePrice);

      //inyectar al html
      document.querySelector("#services").appendChild(serviceDiv);
    });
  } catch (error) {
    console.log(error);
  }
};

const selectService = (e) => {
  let element;

  if (e.target.tagName === "P") {
    element = e.target.parentElement;
  } else {
    element = e.target;
  }

  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
  } else {
    element.classList.add("selected");
  }
  console.log(element.dataset.id);
};


const previousPage = () => {
    const previousPage = document.querySelector("#previous")
    previousPage.addEventListener("click", () => {
        if(page > 1) {
            page--;
        }
        console.log(page);
    })
}

const nextPage = () => {
    const nextPage = document.querySelector("#next")
    nextPage.addEventListener("click", () => {
        if(page < 3) {
            page++;
        }
        console.log(page);
    })
}