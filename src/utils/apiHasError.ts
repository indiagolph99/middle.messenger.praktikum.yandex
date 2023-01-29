export default function apiHasError(response: Indexed) {
  return response && response.reason;
}
