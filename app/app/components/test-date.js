const dateString = new Date().toISOString();
const date = new Date(dateString);
const now = new Date();
const isToday = date.toDateString() === now.toDateString();
const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
console.log(`Today, ${timeString}`);
