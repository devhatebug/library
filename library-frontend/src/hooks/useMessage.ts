import { notification } from "antd";
import type { NotificationArgsProps } from "antd";

type NotificationPlacement = NotificationArgsProps["placement"];

const useMessage = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    description: string
  ) => {
    api.info({
      message: `Notification`,
      description: description,
      placement,
    });
  };
  return {
    openNotification,
    contextHolder,
  };
};

export default useMessage;
