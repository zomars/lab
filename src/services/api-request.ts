export function apiRequest(
  url: string,
  method = 'get',
  payload: unknown = null,
): Promise<Response> {
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('API-Version', '1.0');

  return fetch(url, {
    body: JSON.stringify(payload),
    headers,
    method,
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }

    return response;
  });
}
