import moment from "moment";

export const formatDateToDB = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };



  /**
 * Format date based on whether it's today, yesterday, or older.
 * @param {string | Date} date - The date to format.
 * @returns {string} - Formatted date string.
 */
export const formatChatTime = (date:any) => {
  const itemDate = moment(date);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');

  if (itemDate.isSame(today, 'day')) {
    return itemDate.format('h:mm A'); // Time format for today
  } else if (itemDate.isSame(yesterday, 'day')) {
    return 'Yesterday'; // Display "Yesterday" for yesterday
  } else {
    return itemDate.format('MMM D, YYYY'); // Date format for older dates
  }
};