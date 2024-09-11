import moment from "moment";
import 'moment/locale/id';

export const useMoment = () => {
  moment.locale('id');

  return {
    moment
  }
}