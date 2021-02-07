import './styles/main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Event from './event';

const nameOfMembers = ['Maria', 'Bob', 'Alex'];
const time = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
let currentMember = null;
let modalDaySelect = '';
let modalTimeSelect = '';
const participants = new Set();
const events = [
  new Event(
    '11:00',
    'Mon',
    ['Maria', 'Bob'],
    'Planning session',
  ),
  new Event(
    '10:00',
    'Fri',
    ['Alex'],
    'Retrospective',
  ),
];

const baseUrl = window.location.origin;

window.history.pushState({}, null, `${baseUrl}/calendar`);

function findByName(name) {
  return events.filter((event) => event.hasMember(name));
}

function deleteByName(nameOfEvent, callback) {
  for (let i = 0; i < events.length; i += 1) {
    if (events[i].name === nameOfEvent) {
      events.splice(i, 1);
    }
  }
  callback(currentMember || 'All members');
}

function handlerDeleteButton(e, callback) {
  const root = document.getElementById('root');
  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-window');
  const p = document.createElement('p');
  p.textContent = `Are you sure you want to delete '${e.target.value}' event?`;
  p.classList.add('warning-text');
  modalWindow.append(p);
  const containerForButton = document.createElement('div');
  containerForButton.classList.add('container-for-button');
  const buttonNo = document.createElement('button');
  buttonNo.textContent = 'No';
  buttonNo.addEventListener('click', () => modalWindow.remove());
  buttonNo.classList.add('modal-button');
  const buttonYes = document.createElement('button');
  buttonYes.textContent = 'Yes';
  buttonYes.addEventListener('click', () => {
    modalWindow.remove();
    deleteByName(e.target.value, callback);
  });
  buttonYes.classList.add('modal-button');
  containerForButton.append(buttonNo);
  containerForButton.append(buttonYes);
  modalWindow.append(containerForButton);
  root.append(modalWindow);
}

function drawEvent(members) {
  for (let i = 0; i < 9; i += 1) {
    for (let j = 1; j < 6; j += 1) {
      const targetTd = document.getElementById(`${time[i]} ${days[j]}`);
      targetTd.innerHTML = '';
      targetTd.classList.remove('td-with-event');
    }
  }
  const displayed = members === 'All members' ? events : findByName(members);
  for (let i = 0; i < displayed.length; i += 1) {
    const idOfTd = `${displayed[i].eventTime} ${displayed[i].day}`;
    const targetTd = document.getElementById(idOfTd);
    targetTd.textContent = displayed[i].name;
    const buttonDelete = document.createElement('button');
    buttonDelete.textContent = 'x';
    buttonDelete.setAttribute('value', displayed[i].name);
    buttonDelete.classList.add('button-delete');
    buttonDelete.addEventListener('click', (e) => handlerDeleteButton(e, drawEvent));
    targetTd.classList.add('td-with-event');
    targetTd.append(buttonDelete);
  }
}

function drawTable() {
  const tbody = document.getElementsByTagName('tbody')[0];
  for (let i = 0; i < 9; i += 1) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 6; j += 1) {
      const td = document.createElement('td');
      if (j === 0) {
        td.textContent = time[i];
      }
      td.setAttribute('id', `${time[i]} ${days[j]}`);
      tr.append(td);
    }
    tbody.append(tr);
  }
}
drawTable();
drawEvent('All members');

function selectMemberForFiltering(e) {
  currentMember = e.target.value;
  drawEvent(e.target.value);
}

function renderMembers(members) {
  const selectMembers = document.getElementById('members');
  selectMembers.addEventListener('change', selectMemberForFiltering);
  members.forEach((item) => {
    const option = document.createElement('option');
    option.setAttribute('value', item);
    option.textContent = item;
    selectMembers.append(option);
  });
}
renderMembers(nameOfMembers);

function createEvent(name, members, eventTime, day, arrWithEvents) {
  const event = new Event(eventTime, day, members, name, arrWithEvents);
  arrWithEvents.push(event);
  const creatNewEvent = document.getElementsByClassName('creat-new-event')[0];
  creatNewEvent.setAttribute('hidden', 'true');
  const container = document.getElementsByClassName('container')[0];
  container.removeAttribute('hidden');
  window.history.pushState({}, null, `${baseUrl}/calendar`);
  drawEvent('All members');
}

function handlerCreateNewEvent() {
  const createNewEvent = document.getElementsByClassName('creat-new-event')[0];
  createNewEvent.removeAttribute('hidden');
  const container = document.getElementsByClassName('container')[0];
  container.setAttribute('hidden', 'true');
  window.history.pushState({}, null, `${baseUrl}/create-event`);
}

const buttonCreateNewEvent = document.getElementById('new-event');
buttonCreateNewEvent.addEventListener('click', handlerCreateNewEvent);

function updateParticipants(participantsSet) {
  const text = [...participantsSet.values()].join();
  const modalSelect = document.getElementById('modal-select');
  modalSelect.innerHTML = text;
}

function toggleMember(e) {
  if (e.target.checked) {
    participants.add(e.target.value);
  }
  if (!e.target.checked) {
    participants.delete(e.target.value);
  }
  updateParticipants(participants);
}

function renderModalMembers(members) {
  const divCheckboxes = document.getElementById('checkboxes');
  for (let i = 0; i < members.length; i += 1) {
    const input = document.createElement('input');
    input.setAttribute('value', members[i]);
    input.setAttribute('id', `${i}`);
    input.setAttribute('type', 'checkbox');
    input.addEventListener('change', toggleMember);
    const label = document.createElement('label');
    label.setAttribute('for', `${i}`);
    label.textContent = members[i];
    label.prepend(input);
    divCheckboxes.append(label);
  }
}
renderModalMembers(nameOfMembers);

let expanded = false;

function showCheckboxes() {
  const checkboxes = document.getElementById('checkboxes');
  if (!expanded) {
    checkboxes.style.display = 'block';
    expanded = true;
  } else {
    checkboxes.style.display = 'none';
    expanded = false;
  }
}

const selectBox = document.getElementsByClassName('selectBox')[0];
selectBox.addEventListener('click', showCheckboxes);

function handleWriteDay(e) {
  modalDaySelect = e.target.value;
}

function handleWriteTime(e) {
  modalTimeSelect = e.target.value;
}

function renderModalDays(daysArg) {
  const modalDays = document.getElementById('modal-days');
  for (let i = 1; i < daysArg.length; i += 1) {
    const option = document.createElement('option');
    option.setAttribute('value', daysArg[i]);
    option.textContent = daysArg[i];
    modalDays.addEventListener('change', handleWriteDay);
    modalDays.append(option);
  }
}
renderModalDays(days);

function renderModalTime(timeArg) {
  const modalTime = document.getElementById('modal-time');
  for (let i = 0; i < timeArg.length; i += 1) {
    const option = document.createElement('option');
    option.setAttribute('value', timeArg[i]);
    option.textContent = timeArg[i];
    modalTime.addEventListener('change', handleWriteTime);
    modalTime.append(option);
  }
}
renderModalTime(time);

const errorWindow = document.getElementsByClassName('error-window')[0];
function createError(errorMessage) {
  errorWindow.removeAttribute('hidden');
  errorWindow.getElementsByClassName('error-text')[0].textContent = errorMessage;
}

function checkIfAlreadyBooked(participantsArg, timeArg, day, arrWithEvents) {
  const members = [...participantsArg.values()];
  const inputName = document.getElementById('event-name-modal').value;
  if (inputName === '' || members.join() === '' || timeArg === '' || day === '') {
    createError('Please select required event options');
    return;
  }
  for (let i = 0; i < events.length; i += 1) {
    if (events[i].eventTime === timeArg && events[i].day === day) {
      createError('Failed to create an event. Time slot is already booked');
      return;
    }
  }
  createEvent(inputName, members, timeArg, day, arrWithEvents);
  errorWindow.setAttribute('hidden', 'true');
}

const buttonCreateEvent = document.getElementById('create-event');
buttonCreateEvent.addEventListener('click', () => checkIfAlreadyBooked(participants, modalTimeSelect, modalDaySelect, events));

function handlerCancelError() {
  errorWindow.setAttribute('hidden', 'true');
}

const errorButtonCancel = document.getElementsByClassName('error-button-cancel')[0];
errorButtonCancel.addEventListener('click', handlerCancelError);

function handlerCancelEvent() {
  const creatNewEvent = document.getElementsByClassName('creat-new-event')[0];
  creatNewEvent.setAttribute('hidden', 'true');
  const container = document.getElementsByClassName('container')[0];
  container.removeAttribute('hidden');
  window.history.pushState({}, null, `${baseUrl}/calendar`);
}

const buttonCancelEvent = document.getElementById('cancel-event');
buttonCancelEvent.addEventListener('click', handlerCancelEvent);
