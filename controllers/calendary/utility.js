const getTimeSlots = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0); // set start time to midnight

  const end = new Date();
  end.setHours(23, 59, 59, 999); // set end time to 1 millisecond before midnight

  const timeSlots = [];
  let current = start;

  while (current <= end) {
    timeSlots.push(
      current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    current = new Date(current.getTime() + 30 * 60000); // add 30 minutes to current time
  }

  return timeSlots;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

module.exports = {
  getTimeSlots,
  getDaysInMonth,
};
