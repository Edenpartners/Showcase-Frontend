import { message } from 'antd/lib/index';

export default function (isSucess, text, displayTime) {
  if (!isSucess) {
    message.error(text, displayTime || 2);
  } else {
    message.success(text, displayTime || 2);
  }
}
