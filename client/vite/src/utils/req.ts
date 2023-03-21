import { apiUrl } from "../vars";

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function callAction(
  action: string,
  data: any,
  method: Method = "POST"
): Promise<any> {
  return await fetch(apiUrl + "?action=" + action, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
