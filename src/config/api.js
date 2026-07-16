const configuredApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const normalizeSameDomainApiUrl = (url) => {
  if (typeof window === "undefined") return url;

  try {
    const apiUrl = new URL(url);
    const currentUrl = new URL(window.location.origin);
    const normalizeHost = (host) => host.replace(/^www\./, "");
    const isSameDomain = normalizeHost(apiUrl.hostname) === normalizeHost(currentUrl.hostname);
    const isSameProtocol = apiUrl.protocol === currentUrl.protocol;

    if (isSameDomain && isSameProtocol) {
      return currentUrl.origin;
    }
  } catch {
    return url;
  }

  return url;
};

/* Same-domain API URL normalization V1 */
export const API_URL = normalizeSameDomainApiUrl(configuredApiUrl);
