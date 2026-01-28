import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


/**
 * Hook to handle progress loading notifications
 * Automatically transforms from loading -> success/error
 */
export function useLoadingNotification() {
  
  const { t } = useTranslation(['common', 'orders']);

  /**
   * @param {string} key - Unique ID for the notification (e.g., 'orders_load', 'products_load')
   * @param {string} titleKey - i18n key for the title (e.g., 'orders:notifications.loading')
   * @param {Function} asyncFn - Async function to execute
   * @returns {Promise} Result of asyncFn
   */
  const showProgressNotification = useCallback(
    async (key, titleKey, asyncFn) => {
      // Show loading notification
      const notifId = notifications.show({
        id: key,
        loading: true,
        title: t(titleKey),
        message: t('common:app.pleaseWait'),
        autoClose: false,
        withCloseButton: false,
      });

      try {
        // Execute async function
        const result = await asyncFn();

        // Update to success
        notifications.update({
          id: notifId,
          color: 'green',
          title: t(titleKey.replace('loading', 'success')),
          message: t('common:app.completed'),
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 2000,
        });

        return result;
      } 
      catch (error) {
        // Update to error
        notifications.update({
          id: notifId,
          color: 'red',
          title: t(titleKey.replace('loading', 'error')),
          message: error.message,
          icon: <IconAlertCircle size={18} />,
          loading: false,
          autoClose: 4000,
        });

        throw error;
      }
    },
    [t]
  );

  return { showProgressNotification };
}
