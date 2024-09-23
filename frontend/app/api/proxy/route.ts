import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const url = request.headers.get("url");
  const res = await fetch(`${process.env.AUTH_API_URL}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    return NextResponse.json(
      { message: await res.json() },
      { status: res.status },
    );
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const url = request.headers.get("url");
    let body;
    const contentType = request.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    }
    console.log(JSON.stringify(contentType, null, 2));

    const res = await fetch(`${process.env.AUTH_API_URL}${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": contentType || "application/json",
      },
      body,
    });
    if (!res.ok) {
      return NextResponse.json(
        { message: await res.json() },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session || !session.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const url = request.headers.get("url");
  let body;
  const contentType = request.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    body = await request.json();
  } else if (contentType?.includes("multipart/form-data")) {
    body = await request.formData();
  }
  const res = await fetch(`${process.env.AUTH_API_URL}${url}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": contentType || "application/json",
      body,
    },
  });
  if (!res.ok) {
    return NextResponse.json(
      { message: await res.json() },
      { status: res.status },
    );
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !session.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const url = request.headers.get("url");
  const res = await fetch(`${process.env.AUTH_API_URL}${url}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    return NextResponse.json(
      { message: await res.json() },
      { status: res.status },
    );
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
