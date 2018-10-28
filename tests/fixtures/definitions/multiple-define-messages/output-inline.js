import { defineMessages } from 'react-intl';
const ERROR_CONSTS = {
  BAD_REQUEST: 'BAD_REQUEST',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  UNDEFINED: 'UNDEFINED'
};
export const errors = defineMessages({
  [ERROR_CONSTS.BAD_REQUEST]: {
    id: 'bad_request',
    "defaultMessage": "Bad request"
  },
  [ERROR_CONSTS.FORBIDDEN]: {
    id: 'forbidden',
    "defaultMessage": "Forbidden"
  },
  [ERROR_CONSTS.NOT_FOUND]: {
    id: 'not_found',
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
    id: 'abort',
    "defaultMessage": "Abort"
  },
  Delete: {
    id: 'delete',
    "defaultMessage": "Delete"
  },
  Continue: {
    id: 'continue',
    description: 'continue',
    "defaultMessage": "Continue"
  }
});
