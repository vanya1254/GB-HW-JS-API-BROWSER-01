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

const JSON_USER_DATA = `{
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false
}`;

`<tr> 
<td>Йога</td>
<td>10:00 - 11:00</td>
<td>15</td> <td>8</td>
<td class="button"><button>Записаться</button></td>
<td class="button"><button>Отменить запись</button></td>
</tr>`;

const INITIAL_DATA = JSON.parse(JSON_DATA);
const INITIAL_USER_DATA = JSON.parse(JSON_USER_DATA);
const tbodyEl = document.getElementById("tbody");

const createTrEl = (dataTr, id, wasRegistered) => {
  let trEl = document.createElement("tr");
  trEl.dataset.id = id;

  trEl.insertAdjacentHTML(
    "beforeend",
    `<tr> 
        <td class="name">${dataTr.name}</td>
        <td class="time">${dataTr.time}</td>
        <td class="maxParticipants">${dataTr.maxParticipants}</td>
        <td class="currentParticipants">${dataTr.currentParticipants}</td>
        <td class="button"><button class="registerBtn" ${
          wasRegistered || dataTr.maxParticipants === dataTr.currentParticipants
            ? "disabled"
            : ""
        }>Записаться</button></td>
        <td class="button"><button class="cancelBtn" ${
          wasRegistered ? "" : "disabled"
        }
          >Отменить запись</button></td>
    </tr>`
  );

  tbodyEl.appendChild(trEl);
};

const checkedRenderLessons = (dataUser) => {
  const lessonsLocalStorage = localStorage.getItem("lessons");

  if (lessonsLocalStorage) {
    console.log(111);
    let lessonsData = JSON.parse(lessonsLocalStorage);

    for (const key in lessonsData) {
      createTrEl(lessonsData[key], key, dataUser[key]);
    }
  } else {
    console.log(222);
    localStorage.setItem("lessons", JSON_DATA);

    for (const key in INITIAL_DATA) {
      createTrEl(INITIAL_DATA[key], key, dataUser[key]);
    }
  }
};

const updateTrEl = (target, action) => {
  let trEl = target.closest("[data-id]");

  let lessons = JSON.parse(localStorage.getItem("lessons"));
  let userData = JSON.parse(localStorage.getItem("userData"));

  let currentParticipants = trEl.querySelector(".currentParticipants");
  let registerBtn = trEl.querySelector(".registerBtn");
  let cancelBtn = trEl.querySelector(".cancelBtn");

  if (action) {
    lessons[trEl.dataset.id].currentParticipants += 1;
    userData[trEl.dataset.id] = true;
    currentParticipants.innerHTML = Number(currentParticipants.innerHTML) + 1;
    registerBtn.disabled = true;
    cancelBtn.disabled = false;
  } else {
    lessons[trEl.dataset.id].currentParticipants -= 1;
    userData[trEl.dataset.id] = false;
    currentParticipants.innerHTML = Number(currentParticipants.innerHTML) - 1;
    registerBtn.disabled = false;
    cancelBtn.disabled = true;
  }

  localStorage.setItem("lessons", JSON.stringify(lessons));
  localStorage.setItem("userData", JSON.stringify(userData));
};

const userDataLocalStorage = localStorage.getItem("userData");

if (userDataLocalStorage) {
  console.log(333);

  let userData = JSON.parse(userDataLocalStorage);
  checkedRenderLessons(userData);
} else {
  console.log(444);

  localStorage.setItem("userData", JSON_USER_DATA);
  checkedRenderLessons(INITIAL_USER_DATA);
}

const registerBtnElClick = (target) => {
  console.log(555);

  const action = true;
  updateTrEl(target, action);
};

const cancelBtnElClick = (target) => {
  console.log(target, 666);

  const action = false;
  updateTrEl(target, action);
};

tbodyEl.addEventListener("click", ({ target }) => {
  if (target.matches(".registerBtn")) {
    registerBtnElClick(target);
  }
  if (target.matches(".cancelBtn")) {
    cancelBtnElClick(target);
  }
});
