export async function promiseHandler(promise) {
  try {
    const result = await promise;
    return { success: true, response: result };
  } catch (error) {
    const { response } = error;
    const errMessage =
      response?.data?.message ||
      "An unexpected error occured. Please check internet connection or try again later.";
    return { success: false, error: { message: errMessage } };
  }
}
