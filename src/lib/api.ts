import { appConfig } from "@lib/config";

export interface HttpErrorDetails {
  [key: string]: unknown;
}

export class HttpError extends Error {
  status: number;
  code: string;
  details: HttpErrorDetails;

  constructor(
    status: number,
    code: string,
    message: string,
    details: HttpErrorDetails = {},
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = "HttpError";
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type QueryValue = string | number | boolean | null | undefined;
type RequestBody = Record<string, unknown> | FormData | null;

interface FetchOptions {
  method: HttpMethod;
  headers: Record<string, string>;
  credentials: RequestCredentials;
  body?: BodyInit;
}

export class Api {
  private refreshPromise: Promise<boolean> | null = null;
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
    body?: RequestBody,
  ): Promise<FetchOptions> {
    const headers: Record<string, string> = {};

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const options: FetchOptions = {
      method,
      headers,
      credentials: "include",
    };

    if (body instanceof FormData) {
      options.body = body;
    } else if (body) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    return options;
  }

  private async apiFetch<T>(
    endpoint: string,
    method: HttpMethod,
    body?: RequestBody,
    retry = true,
  ): Promise<T> {
    if (endpoint.startsWith("/")) {
      endpoint = endpoint.slice(1);
    }

    const options = await this.createFetchOptions(method, body);
    const response = await fetch(`${this.url}/${endpoint}`, options);

    if (!response.ok) {
      if (
        response.status === 401 &&
        retry &&
        !endpoint.endsWith("auth/login")
      ) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          return this.apiFetch<T>(endpoint, method, body, false);
        }
      }

      let errorData: {
        code?: string;
        detail?: string;
        message?: string;
        details?: HttpErrorDetails;
        errors?: HttpErrorDetails;
      } = {
        message: "Unknown error",
        details: {},
      };

      try {
        errorData = await response.json();
      } catch {
        // ignore parse error
      }

      const error = new HttpError(
        response.status,
        errorData.code || "UNKNOWN_ERROR",
        errorData.message ||
          errorData.code ||
          errorData.detail ||
          "Unknown error",
        errorData.details || errorData.errors || {},
      );
      this.handleHttpError(error);
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.url}/auth/refresh`, {
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
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, QueryValue> | null,
  ): Promise<T> {
    if (params && typeof params === "object") {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query.set(key, String(value));
        }
      });
      const queryString = query.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    return this.apiFetch<T>(endpoint, "GET");
  }

  async post<T>(endpoint: string, body?: RequestBody): Promise<T> {
    return this.apiFetch<T>(endpoint, "POST", body);
  }

  async put<T>(endpoint: string, body?: RequestBody): Promise<T> {
    return this.apiFetch<T>(endpoint, "PUT", body);
  }

  async delete<T>(endpoint: string, body?: RequestBody): Promise<T> {
    return this.apiFetch<T>(endpoint, "DELETE", body);
  }

  async patch<T>(endpoint: string, body?: RequestBody): Promise<T> {
    return this.apiFetch<T>(endpoint, "PATCH", body);
  }

  async getBlob(endpoint: string, retry = true): Promise<Blob> {
    if (endpoint.startsWith("/")) {
      endpoint = endpoint.slice(1);
    }

    const options = await this.createFetchOptions("GET");
    const response = await fetch(`${this.url}/${endpoint}`, options);

    if (!response.ok) {
      if (response.status === 401 && retry) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          return this.getBlob(endpoint, false);
        }
      }

      throw new HttpError(
        response.status,
        "BLOB_ERROR",
        "Blob request failed",
        {},
      );
    }

    return response.blob();
  }

  private handleHttpError(error: HttpError): void {
    console.error(error);
    const status = error.status;

    if (status === 403) {
      alert("アクセスが拒否されました");
    } else if (
      status === 401 &&
      (error.code.startsWith("AUTH_") || error.code.startsWith("REFRESH_")) &&
      window.location.pathname !== "/login"
    ) {
      window.location.replace("/login");
    }
  }
}

export const api = new Api(appConfig.apiUrl);
