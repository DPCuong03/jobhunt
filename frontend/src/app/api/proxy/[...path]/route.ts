import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL; // internal, not public

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxyRequest(req, params.path, "GET");
}
export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxyRequest(req, params.path, "POST");
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxyRequest(req, params.path, "PUT");
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  return proxyRequest(req, params.path, "DELETE");
}

async function proxyRequest(
  req: NextRequest,
  pathSegments: string[],
  method: string,
) {
  const path = pathSegments.join("/");
  const search = req.nextUrl.search;
  const url = `${BACKEND_URL}/api/${path}${search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Forward cookies to backend
    cookie: req.headers.get("cookie") || "",
  };

  const body =
    method !== "GET" && method !== "DELETE" ? await req.text() : undefined;

  const backendRes = await fetch(url, { method, headers, body });

  const resBody = await backendRes.text();
  const response = new NextResponse(resBody, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });

  // Forward Set-Cookie from backend to browser (now on vercel.app domain)
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
