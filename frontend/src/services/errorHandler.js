export async function errorHandler(promise) {
  try {
    let data = await promise;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
