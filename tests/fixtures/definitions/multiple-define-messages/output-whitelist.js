import { defineMessages } from 'react-intl';
const ERROR_CONSTS = {
  BAD_REQUEST: 'BAD_REQUEST',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  UNDEFINED: 'UNDEFINED'
};
export const errors = defineMessages({
  [ERROR_CONSTS.BAD_REQUEST]: {
    id: "2269986258",
    "defaultMessage": "Bad request"
  },
  [ERROR_CONSTS.FORBIDDEN]: {
    id: "3721599250",
    "defaultMessage": "Forbidden"
  },
  [ERROR_CONSTS.NOT_FOUND]: {
    id: "2687396305",
    "defaultMessage": "Not found"
  },
  [ERROR_CONSTS.UNDEFINED]: {
    id: 'undefined'
  }
});
export default defineMessages({
  Cancel: {
    id: 'cancel',
    "defaultMessage": "Cancel"
  },
  Abort: {
    id: "2771110649",
    "defaultMessage": "Abort"
  },
  Delete: {
    id: "1740784714",
    "defaultMessage": "Delete"
  },
  Continue: {
    id: "2977070660",
    description: 'continue',
    "defaultMessage": "Continue"
  }
});
