export interface HttpErrorDetails {
  [key: string]: any;
}

export class HttpError extends Error {
  status: number;
  details: HttpErrorDetails;

  constructor(status: number, message: string, details: HttpErrorDetails = {}) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "HttpError";
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  credentials: RequestCredentials;
  body?: string;
}

export class Api {
  private url: string;
  private accessToken: string | null = null;
  private onAccessTokenRefresh?: (token: string) => void;

  constructor(url: string, onAccessTokenRefresh?: (token: string) => void) {
    this.url = url;
    this.onAccessTokenRefresh = onAccessTokenRefresh;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  setAccessTokenCallback(callback: (token: string) => void) {
    this.onAccessTokenRefresh = callback;
  }

  private async createFetchOptions(
    method: HttpMethod,
    body?: Record<string, unknown> | null
  ): Promise<FetchOptions> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const options: FetchOptions = {
      method,
      headers,
      credentials: "include",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return options;
  }

  private async apiFetch<T>(
    endpoint: string,
    method: HttpMethod,
    body?: Record<string, unknown> | null,
    retry = true
  ): Promise<T> {
    if (endpoint.startsWith("/")) {
      endpoint = endpoint.slice(1);
    }

    const options = await this.createFetchOptions(method, body);
    const response = await fetch(`${this.url}/${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401 && retry && window.location.pathname !== "/login") {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          return this.apiFetch<T>(endpoint, method, body, false);
        }
      }

      let errorData: { message: string; details: HttpErrorDetails } = {
        message: "Unknown error",
        details: {},
      };

      try {
        errorData = await response.json();
      } catch {
        // ignore parse error
      }

      const error = new HttpError(response.status, errorData.message, errorData.details);
      this.handleHttpError(error);
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/accounts/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) return false;

      const newToken = (await response.json()).access_token;
      if (newToken) {
        this.accessToken = newToken;

        if (this.onAccessTokenRefresh) {
          this.onAccessTokenRefresh(newToken);
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any> | null): Promise<T> {
    if (params && typeof params === "object") {
      const query = new URLSearchParams(params).toString();
      endpoint += `?${query}`;
    }
    return this.apiFetch<T>(endpoint, "GET");
  }

  async post<T>(endpoint: string, body?: Record<string, unknown> | null): Promise<T> {
    return this.apiFetch<T>(endpoint, "POST", body);
  }

  async put<T>(endpoint: string, body?: Record<string, unknown> | null): Promise<T> {
    return this.apiFetch<T>(endpoint, "PUT", body);
  }

  async delete<T>(endpoint: string, body?: Record<string, unknown> | null): Promise<T> {
    return this.apiFetch<T>(endpoint, "DELETE", body);
  }

  async patch<T>(endpoint: string, body?: Record<string, unknown> | null): Promise<T> {
    return this.apiFetch<T>(endpoint, "PATCH", body);
  }

  private handleHttpError(error: HttpError): void {
    console.error(error);
    const status = error.status;

    if (status === 403) {
      alert("アクセスが拒否されました");
    } else if (status === 401 && window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }
}

export const api = new Api(import.meta.env.VITE_API_URL || "/api");
