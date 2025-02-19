export const successResponse = (data: any, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = "Generic Error") => ({
  success: false,
  message,
});
