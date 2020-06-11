
interface IOptions {
  success: boolean;
  message?: string;
  data?: any;
  error?: {
    code: string;
    message: string;
  }
}

export function CustomResponse(options: IOptions) {
  const success = options.success;
  const data = options.data;
  const error = options.error;
  const message = options.message;
  
  if (success) {
    return {
      ...options,
      success,
      message,
      data,
    }
  } else {
    return {
      success,
      error: {
        code: error && error.code ? error.code : '',
        message: error && error.message ? error.message : '',
      }
    }
  }
}