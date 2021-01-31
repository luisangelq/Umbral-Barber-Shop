let page = 1;

const appointment = {
  name: "",
  date: "",
  time: "",
  services: [],
};

document.addEventListener("DOMContentLoaded", () => {
  startApp();

  //hightlight Current Div
  showSection();

  //hide or show section
  changeSection();

  previousPage();

  nextPage();

  //check for show or hide pagination
  paginationButton();

  //Show Summary
  showSummary();

  //save Name
  saveName();

  //save Date
  saveDate();

  //save Time
  saveTime();

  //disable last dates
  disableLastDays();
});

const showSection = () => {
  //delete previous section
  const previousSection = document.querySelector(".show-section");
  if (previousSection) {
    previousSection.classList.remove("show-section");
  }

  const currentSection = document.querySelector(`#step-${page}`);
  currentSection.classList.add("show-section");

  const previousTab = document.querySelector(".current");
  if (previousTab) {
    previousTab.classList.remove("current");
  }

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

      showSection();
      paginationButton();
    });
  });
};

const startApp = () => {
  showServices();
};
const showServices = async () => {
  try {

    const url = "http://localhost:3000/services.php"

    const result = await fetch("services.json" ); // "services.json")
    const db = await result.json();

    //generate html
    db.forEach((service) => {
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

    const id = Number(element.dataset.id);

    deleteService(id);
  } else {
    element.classList.add("selected");

    const serviceObj = {
      id: Number(element.dataset.id),
      name: element.firstElementChild.textContent,
      price: element.firstElementChild.nextElementSibling.textContent,
    };

    addService(serviceObj);
  }
};

const addService = (serviceObj) => {
  const { services } = appointment;
  appointment.services = [...services, serviceObj];

  console.log(appointment);
};

const deleteService = (id) => {
  const { services } = appointment;
  appointment.services = services.filter((service) => service.id !== id);

  console.log(appointment);
};

const previousPage = () => {
  const previousPage = document.querySelector("#previous");
  previousPage.addEventListener("click", () => {
    page--;
    paginationButton();
  });
};

const nextPage = () => {
  const nextPage = document.querySelector("#next");
  nextPage.addEventListener("click", () => {
    page++;

    paginationButton();
  });
};

const paginationButton = () => {
  const previousPage = document.querySelector("#previous");
  const nextPage = document.querySelector("#next");

  if (page === 1) {
    previousPage.classList.add("hidde");
  } else if (page === 3) {
    nextPage.classList.add("hidde");
    previousPage.classList.remove("hidde");

    showSummary();
  } else {
    previousPage.classList.remove("hidde");
    nextPage.classList.remove("hidde");
  }

  showSection();
};

const showSummary = () => {
  const { name, date, time, services } = appointment;

  const summaryDiv = document.querySelector(".summary-content");

  //clean previous html
  while (summaryDiv.firstElementChild.nextElementSibling) {
    summaryDiv.firstElementChild.nextElementSibling.remove();
  }

  if (Object.values(appointment).includes("")) {
    const errors = document.createElement("P");

    errors.textContent = "All Fields Of Information Are Required";
    errors.classList.add("error-date");

    summaryDiv.appendChild(errors);
  } else {
    //Showing Summary
    const nameA = document.createElement("P");
    nameA.innerHTML = `<span>Name: </span> ${name}`;
    const dateA = document.createElement("P");
    dateA.innerHTML = `<span>Date:</span> ${date}`;
    const timeA = document.createElement("P");
    timeA.innerHTML = `<span>Time:</span> ${time}`;

    //iterar sobre servicios
    const serviceContent = document.createElement("DIV");
    serviceContent.classList.add("service-content");

    const headingService = document.createElement("H3");
    headingService.textContent = "Services Summary";
    serviceContent.appendChild(headingService);

    let total = 0;
    services.forEach((service) => {
      const { name, price } = service;

      const serviceDiv = document.createElement("DIV");
      serviceDiv.classList.add("service-div");

      const nameService = document.createElement("P");
      nameService.textContent = name;

      const priceService = document.createElement("P");
      priceService.textContent = price;
      priceService.classList.add("price");

      const totalServices = price.split("$");
      total += Number(totalServices[1].trim());
      

      serviceDiv.appendChild(nameService);
      serviceDiv.appendChild(priceService);

      serviceContent.appendChild(serviceDiv);
    });

    summaryDiv.appendChild(nameA);
    summaryDiv.appendChild(dateA);
    summaryDiv.appendChild(timeA);
    summaryDiv.appendChild(serviceContent);

    const totalPay = document.createElement("P")
    totalPay.classList.add("totals")
    totalPay.innerHTML = `<span>Total: </span> $${total}`
    summaryDiv.appendChild(totalPay)
  }
};

const saveName = () => {
  const nameInput = document.querySelector("#name");

  nameInput.addEventListener("input", (e) => {
    const textName = e.target.value.trim();

    if (textName === "" || textName.length < 3 || textName > 50) {
      showAlert("Invalid Name", "error");
    } else {
      const alert = document.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
      appointment.name = textName;
      console.log(appointment);
    }
  });
};

const showAlert = (message, type) => {
  const previousAlert = document.querySelector(".alert");
  if (previousAlert) {
    return;
  }

  const alert = document.createElement("DIV");

  alert.textContent = message;
  alert.classList.add("alert");

  if (type === "error") {
    alert.classList.add("error");
  } else if (type === "warning") {
    alert.classList.add("warning");
  }

  //insert to html
  const form = document.querySelector(".form");
  form.appendChild(alert);

  //after 3 secons delete

  setTimeout(() => {
    alert.remove();
  }, 5000);
};

const saveDate = () => {
  const dateInput = document.querySelector("#date");
  dateInput.addEventListener("input", (e) => {
    const day = new Date(e.target.value).getUTCDay();
    // const today = new Date(e.target.value).getUTCDate();
    // const lastday = new Date().getUTCMonth();

    if ([6, 0].includes(day)) {
      e.preventDefault();
      dateInput.value = "";
      showAlert("Sorry we work from Mondays to Fridays", "warning");
    } 
  //   else if (today <= lastday) {
  //     e.preventDefault();
  //     dateInput.value = "";
  //     showAlert("This Day Might Be full", "warning");
  //  }
    else {
      const alert = document.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
      appointment.date = dateInput.value;

      console.log(appointment);
    }

    // const options = {
    //   year: "numeric",
    //   month: "long",
    //   weekday: "string"
    // }
    // console.log(day.toLocaleDateString("es-ES", options));
  });
};

const disableLastDays = () => {
  const dateInput = document.querySelector("#date");

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();

  const concatDate = `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;

  dateInput.min = concatDate;
};

const saveTime = () => {
  const timeInput = document.querySelector("#time");
  timeInput.addEventListener("input", (e) => {
    const dateTime = e.target.value;
    const time = dateTime.split(":");

    if (time[0] < 08 || time[0] > 20) {
      e.preventDefault();
      timeInput.value = "";
      showAlert("Sorry we work from 08:00 am to 08:00 pm", "warning");
    } else {
      const alert = document.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
      appointment.time = dateTime;
    }
    console.log(appointment);
  });
};
