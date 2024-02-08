const JSON_DATA = `{
  "1": {
    "name": "Йога",
    "time": "10:00 - 11:00",
    "maxParticipants": 15,
    "currentParticipants": 8
  },
  "2": {
    "name": "Пилатес",
    "time": "11:30 - 12:30",
    "maxParticipants": 10,
    "currentParticipants": 5
  },
  "3": {
    "name": "Кроссфит",
    "time": "13:00 - 14:00",
    "maxParticipants": 20,
    "currentParticipants": 15
  },
  "4": {
    "name": "Танцы",
    "time": "14:30 - 15:30",
    "maxParticipants": 12,
    "currentParticipants": 12
  },
  "5": {
    "name": "Бокс",
    "time": "16:00 - 17:00",
    "maxParticipants": 8,
    "currentParticipants": 7
  }
}`;

const INITIAL_DATA = JSON.parse(JSON_DATA);
const tbodyEl = document.getElementById("tbody");

const createTrElement = (data, id, wasRegistered) => {
  const trEl = document.createElement("tr");
  trEl.dataset.id = id;

  const { name, time, maxParticipants, currentParticipants } = data;

  trEl.innerHTML = `<td class="name">${name}</td>
                   <td class="time">${time}</td>
                   <td class="maxParticipants">${maxParticipants}</td>
                   <td class="currentParticipants">${currentParticipants}</td>
                   <td class="button">
                      <button class="registerBtn" ${
                        wasRegistered || maxParticipants === currentParticipants
                          ? "disabled"
                          : ""
                      }>
                         Записаться
                      </button>
                   </td>
                   <td class="button">
                      <button class="cancelBtn" ${
                        wasRegistered ? "" : "disabled"
                      }>
                         Отменить запись
                      </button>
                   </td>`;

  tbodyEl.appendChild(trEl);
};

const renderLessons = (lessonsData, userData) => {
  for (const key in lessonsData) {
    const wasRegistered = userData.hasOwnProperty(key) && userData[key];
    createTrElement(lessonsData[key], key, wasRegistered);
  }
};

const updateLessonData = (lessons, userData, trEl, action) => {
  const currentParticipants = trEl.querySelector(".currentParticipants");
  const registerBtn = trEl.querySelector(".registerBtn");
  const cancelBtn = trEl.querySelector(".cancelBtn");

  if (action) {
    lessons[trEl.dataset.id].currentParticipants += 1;
    userData[trEl.dataset.id] = true;
    currentParticipants.innerHTML = Number(currentParticipants.innerHTML) + 1;
    registerBtn.disabled = true;
    cancelBtn.disabled = false;
  } else {
    lessons[trEl.dataset.id].currentParticipants -= 1;
    delete userData[trEl.dataset.id];
    currentParticipants.innerHTML = Number(currentParticipants.innerHTML) - 1;
    registerBtn.disabled = false;
    cancelBtn.disabled = true;
  }

  localStorage.setItem("lessons", JSON.stringify(lessons));
  localStorage.setItem("userData", JSON.stringify(userData));
};

const initializeLocalStorage = () => {
  if (!localStorage.getItem("lessons")) {
    localStorage.setItem("lessons", JSON.stringify(INITIAL_DATA));
  }

  if (!localStorage.getItem("userData")) {
    localStorage.setItem("userData", JSON.stringify({}));
  }
};

const handleButtonClick = (target, action) => {
  const trEl = target.closest("[data-id]");
  const lessons = JSON.parse(localStorage.getItem("lessons")) || INITIAL_DATA;
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  updateLessonData(lessons, userData, trEl, action);
};

const handleTableClick = ({ target }) => {
  if (target.matches(".registerBtn")) {
    handleButtonClick(target, true);
  }
  if (target.matches(".cancelBtn")) {
    handleButtonClick(target, false);
  }
};

initializeLocalStorage();

const userData = JSON.parse(localStorage.getItem("userData")) || {};
const lessonsData = JSON.parse(localStorage.getItem("lessons")) || INITIAL_DATA;

renderLessons(lessonsData, userData);

tbodyEl.addEventListener("click", handleTableClick);
