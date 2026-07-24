let notificationTimer;

function showNotification(message, type = "info") {
  const notification = document.getElementById("siteNotification");
  const messageElement = document.getElementById("siteNotificationMessage");
  const iconElement = document.getElementById("siteNotificationIcon");

  if (!notification || !messageElement || !iconElement) {
    return;
  }

  const icons = {
    success: "✓",
    error: "!",
    info: "i",
  };

  clearTimeout(notificationTimer);
  notification.dataset.type = type;
  notification.setAttribute("role", type === "error" ? "alert" : "status");
  iconElement.textContent = icons[type] ?? icons.info;
  messageElement.textContent = message;
  notification.classList.remove("notification-hidden");

  notificationTimer = setTimeout(hideNotification, type === "error" ? 7000 : 5000);
}

function hideNotification() {
  clearTimeout(notificationTimer);
  const notification = document.getElementById("siteNotification");
  if (notification) {
    notification.classList.add("notification-hidden");
  }
}

window.showNotification = showNotification;
window.hideNotification = hideNotification;
