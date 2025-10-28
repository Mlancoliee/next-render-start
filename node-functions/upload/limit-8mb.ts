const EIGHT_MB = 8 * 1024 * 1024; // 8 MiB

export const onRequestGet = async (): Promise<Response> => {
  return new Response(
    JSON.stringify({
      message: "POST binary or JSON/body data to this endpoint to test 8MB request limit.",
      hint: "Use curl: curl -X POST --data-binary @bigfile.bin http://<host>/upload/limit-8mb",
      limitBytes: EIGHT_MB,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }
  );
};

export const onRequestPost = async ({ request }: { request: Request }): Promise<Response> => {
  // Fast-fail with Content-Length if provided (support both Headers and Node.js plain object)
  const headersAny: any = (request as any).headers;
  const getHeader = (name: string): string | undefined => {
    try {
      if (headersAny && typeof headersAny.get === "function") {
        const v = headersAny.get(name);
        return v === null ? undefined : v;
      }
      if (headersAny && typeof headersAny === "object") {
        const lower = name.toLowerCase();
        const v = headersAny[lower] ?? headersAny[name] ?? headersAny[lower as keyof typeof headersAny];
        if (Array.isArray(v)) return v[0];
        return typeof v === "string" ? v : v != null ? String(v) : undefined;
      }
    } catch {}
    return undefined;
  };

  const contentLengthHeader = getHeader("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isNaN(contentLength) && contentLength > EIGHT_MB) {
      return new Response(
        JSON.stringify({
          ok: false,
          reason: "content-length-exceeds-limit",
          contentLength,
          limit: EIGHT_MB,
        }),
        {
          status: 413,
          headers: { "Content-Type": "application/json; charset=UTF-8" },
        }
      );
    }
  }

  try {
    // Use arrayBuffer() for Node.js compatibility (instead of body.getReader())
    const arrayBuffer = await request.arrayBuffer();
    const totalBytes = arrayBuffer.byteLength;

    if (totalBytes === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "empty-body" }),
        { status: 400, headers: { "Content-Type": "application/json; charset=UTF-8" } }
      );
    }

    if (totalBytes > EIGHT_MB) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          reason: "body-exceeds-limit", 
          received: totalBytes, 
          limit: EIGHT_MB 
        }),
        { status: 413, headers: { "Content-Type": "application/json; charset=UTF-8" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        received: totalBytes, 
        receivedMB: (totalBytes / 1024 / 1024).toFixed(2),
        limit: EIGHT_MB,
        limitMB: (EIGHT_MB / 1024 / 1024).toFixed(2)
      }),
      { status: 200, headers: { "Content-Type": "application/json; charset=UTF-8" } }
    );
  } catch (err) {
    console.error("upload/limit-8mb error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error)?.message ?? "unknown" }),
      { status: 500, headers: { "Content-Type": "application/json; charset=UTF-8" } }
    );
  }
};

export const onRequest = async ({ request }: { request: Request }): Promise<Response> => {
  if (request.method === "GET") return onRequestGet();
  if (request.method === "POST") return onRequestPost({ request });
  return new Response("Method Not Allowed", { status: 405 });
};


