//@ts-check

/**
 * @typedef {Object} PromiseResponse
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {Object} [response] - The data returned if the operation was successful.
 * @property {Object} [error] - An object containing error details if the operation failed.
 * @property {string} error.message - The error message associated with the error.
 * @property {number} error.status - The error status response code.
 */

/**
 * Takes a promise as an arg and handles success or errors by returning an object.
 * @param {Promise} promise - The promise to handle.
 * @returns {Promise<PromiseResponse>} A promise that resolves to an object containing success status and either data or error information.
 */
export async function promiseHandler(promise) {
  try {
    const result = await promise;
    return { success: true, response: result };
  } catch (error) {
    const errStatus = error.response.status;
    const errMessage = error.response
      ? error.response.data?.message
      : "An unexpected error occurred. Please check your internet connection or try again later.";
    return {
      success: false,
      error: { message: errMessage, status: errStatus },
    };
  }
}
