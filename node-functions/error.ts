export const onRequest = async ({ request }: { request: Request }): Promise<Response> => {
  // Intentionally throw a runtime error to validate failure handling
  const url = (() => {
    try {
      return new URL(request.url);
    } catch {
      return new URL(request.url, "http://localhost:8088");
    }
  })();

  const reason = url.searchParams.get("reason") || "intentional-runtime-error";

  // Throw different kinds of errors for testing via query param
  if (reason === "type-error") {
    // @ts-expect-error Deliberate type misuse to cause runtime error
    const x: any = undefined;
    return x.call();
  }

  if (reason === "syntax-like") {
    // Simulate an unexpected error
    throw new Error("Simulated unexpected error (syntax-like)");
  }

  // Default: always throw
  throw new Error("Intentional runtime error for testing");
};


