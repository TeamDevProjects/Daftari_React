// src/constants/statusCodes.js

export const STATUS_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

export const STATUS_MESSAGES = {
  [STATUS_CODES.UNAUTHORIZED]: 'Unauthorized access. Please log in again.',
  [STATUS_CODES.FORBIDDEN]:
    'You do not have permission to access this resource.',
  [STATUS_CODES.NOT_FOUND]: 'The requested resource could not be found.',
  [STATUS_CODES.INTERNAL_SERVER_ERROR]: 'An internal server error occurred.',
  [STATUS_CODES.BAD_REQUEST]:
    'The request could not be understood by the server.',
  [STATUS_CODES.SERVICE_UNAVAILABLE]: 'The service is temporarily unavailable.',
}
