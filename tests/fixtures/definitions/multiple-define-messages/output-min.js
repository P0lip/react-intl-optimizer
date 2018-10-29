import { defineMessages } from 'react-intl';
const ERROR_CONSTS = {
  BAD_REQUEST: 'BAD_REQUEST',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  UNDEFINED: 'UNDEFINED'
};
export const errors = defineMessages({
  [ERROR_CONSTS.BAD_REQUEST]: {
    id: "2269986258"
  },
  [ERROR_CONSTS.FORBIDDEN]: {
    id: "3721599250"
  },
  [ERROR_CONSTS.NOT_FOUND]: {
    id: "2687396305"
  },
  [ERROR_CONSTS.UNDEFINED]: {
    id: 'undefined'
  }
});
export default defineMessages({
  Cancel: {
    id: "107912219",
    defaultMessage: 'Cancel'
  },
  Abort: {
    id: "2771110649",
    defaultMessage: 'Abort'
  },
  Delete: {
    id: "1740784714"
  },
  Continue: {
    id: "2977070660",
    description: 'continue'
  }
});
