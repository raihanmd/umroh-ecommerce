import { env } from "~/env";

// Create a fetchInstance that wraps around fetch with type safety
export const fetchInstance = async (
  input: RequestInfo | URL, // Matches the first parameter of fetch
  init?: RequestInit, // Matches the second parameter of fetch
): Promise<Response> => {
  const url =
    typeof input === "string" ? `${env.NEXT_PUBLIC_API_URL}${input}` : input;

  // Call the native fetch with the modified URL and provided options
  const response = await fetch(url, init);

  // Optionally, handle errors or return the response directly
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.statusText}`);
  }

  return response;
};
