document.addEventListener('DOMContentLoaded', loadReminders);

const addReminderButton = document.getElementById('addReminder');
addReminderButton.addEventListener('click', addReminder);

function loadReminders() {
  chrome.storage.local.get('reminders', ({ reminders }) => {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = ''; 

    if (reminders) {
      reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.textContent = `${reminder.text} (Заплановано на: ${new Date(reminder.date).toLocaleString()})`;
        li.className = reminder.completed ? 'completed' : '';

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Виконано';
        completeButton.addEventListener('click', () => completeReminder(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';
        deleteButton.addEventListener('click', () => deleteReminder(index));

        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        reminderList.appendChild(li);
      });
    }
  });
}

function addReminder() {
  const reminderInput = document.getElementById('reminderInput');
  const reminderDate = document.getElementById('reminderDate').value;
  const reminderText = reminderInput.value.trim();

  if (reminderText && reminderDate) {
    const reminderTimestamp = new Date(reminderDate).getTime();
    const currentTimestamp = Date.now();

    if (reminderTimestamp > currentTimestamp) {
      chrome.storage.local.get('reminders', ({ reminders }) => {
        const updatedReminders = reminders ? [...reminders, { text: reminderText, date: reminderTimestamp, completed: false }] : [{ text: reminderText, date: reminderTimestamp, completed: false }];
        chrome.storage.local.set({ reminders: updatedReminders }, () => {
          loadReminders();
          reminderInput.value = ''; 
        });
      });
    } else {
      alert('Будь ласка, виберіть дату та час, що не в минулому.');
    }
  } else {
    alert('Заповніть всі поля.');
  }
}

function completeReminder(index) {
  chrome.storage.local.get('reminders', ({ reminders }) => {
    reminders[index].completed = true;
    chrome.storage.local.set({ reminders }, loadReminders);
  });
}

function deleteReminder(index) {
  chrome.storage.local.get('reminders', ({ reminders }) => {
    reminders.splice(index, 1);
    chrome.storage.local.set({ reminders }, loadReminders);
  });
}
