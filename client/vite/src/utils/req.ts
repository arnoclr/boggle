import { apiUrl } from "../vars";
export interface ServerResponse {
  success: boolean;
  data: any;
}

export function toMap(obj: any): Map<string, string> {
  const map = new Map<string, string>();
  for (const key in obj) {
    map.set(key, obj[key]);
  }
  return map;
}
export interface ErrorWithStatus extends Error {
  status: string;
}

/**
 * @throws {ErrorWithStatus}
 */
export async function callAction(
  action: string,
  data: Map<string, string>
): Promise<ServerResponse> {
  const formData = new FormData();
  data.forEach((value, key) => {
    formData.append(key, value);
  });
  let res;

  try {
    res = await fetch(apiUrl + "?action=" + action, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => res.json());
  } catch (e) {
    const error = new Error(
      "Impossible de contacter le serveur"
    ) as ErrorWithStatus;
    error.status = "no_response";
    throw error;
  }

  if (res.success) {
    return res;
  } else {
    const error = new Error(res.error) as ErrorWithStatus;
    error.status = res.status;
    throw error;
  }
}
