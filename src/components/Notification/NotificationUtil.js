import { notification } from 'antd';

// Function to show a success notification
export const showSuccessNotification = (message = 'Success', description = 'Operation completed successfully!') => {
  notification.success({
    message,
    description,
    placement: 'topRight',
    duration: 3, 
  });
};

// Function to show an error notification
export const showErrorNotification = (message = 'Error', description = 'Something went wrong!') => {
  notification.error({
    message,
    description,
    placement: 'topRight',
    duration: 3, 
  });
};
