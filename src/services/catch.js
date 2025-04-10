import { useQuery } from "@tanstack/react-query";

export const parameterDefaults = {
  coordinates: "",
  source: "atlas_haleakela",
  start_date: null,
  stop_date: null,
  radius: null,
  intersection_type: "ImageIntersectsArea",
  size: 5,
  align: true,
};

const apiUrl = "https://catch-api.astro.umd.edu";

// delay in ms
function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetchFromAPI(target) {
  const url = `${apiUrl}/${target}`;
  console.log("fetching", url);
  return await fetch(url);
}

async function fetchObservations({
  ra,
  dec,
  source,
  start_date,
  stop_date,
  radius,
  intersection_type,
}) {
  // parameter validation
  const validRA = typeof ra !== "undefined" && ra !== null;
  const validDec = typeof dec !== "undefined" && dec !== null;

  if (!validRA || !validDec) return Promise.resolve({ count: 0, data: [] });

  const response = await fetchFromAPI(
    `fixed?ra=${ra}&dec=${dec}&sources=${source}` +
    ((start_date || "") && `&start_date=${start_date}`) +
    ((stop_date || "") && `&stop_date=${stop_date}`) +
    ((radius || "") && `&radius=${radius}`) +
    ((radius || "") &&
      (intersection_type || "") &&
      `&intersection_type=${intersection_type}`)
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching observations for ${ra}, ${dec}, ${source} (start_date=${start_date}, stop_date=${stop_date}, radius=${radius}, intersection_type=${intersection_type})`
    );
  }
  return response.json();
}

async function fetchUrl(url, delay) {
  const response = await sleep(delay).then(() => fetch(url));
  if (!response.ok) {
    throw new Error(`Error fetching ${url}`);
  }
  return response.blob();
}

export function useFixedTargetQuery(parameters) {
  return useQuery({
    queryKey: ["fixed", parameters],
    queryFn: () => fetchObservations(parameters),
  });
}

export function useImage(url) {
  return useQuery({
    queryKey: [url],
    queryFn: () => fetchUrl(url, 200),
  });
}
