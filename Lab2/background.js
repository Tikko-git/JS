chrome.runtime.onInstalled.addListener(() => {
    console.log("Розширення встановлено.");
  });
  
  // Функція для створення сповіщення
  function sendNotification(reminderText) {
    const notificationId = `${Date.now()}-${reminderText}`; // Унікальний ID для сповіщення
  
    chrome.notifications.create(notificationId, {
      type: 'basic',
      iconUrl: 'icon.png', 
      title: 'Нагадування',
      message: `Нагадування: ${reminderText}`,
      priority: 2
    });
  }
  
  // Отримуємо нагадування та плануємо сповіщення
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.reminders) {
      const reminders = changes.reminders.newValue;
      reminders.forEach(reminder => {
        const currentTime = Date.now();
        const reminderTime = reminder.date;
  
        if (reminderTime > currentTime) {
          const timeout = reminderTime - currentTime;
          setTimeout(() => {
            sendNotification(reminder.text);
          }, timeout);
        }
      });
    }
  });
  