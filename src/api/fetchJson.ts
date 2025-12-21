export async function fetchJson(baseUrl: string, path: string): Promise<unknown> {
    const url = `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
  
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} for ${url}\n${text}`);
    }
  
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await res.text().catch(() => "");
      throw new Error(`Expected JSON from ${url} but got: ${contentType}\n${text}`);
    }
  
    return res.json();
  }
  