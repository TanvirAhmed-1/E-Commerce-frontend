import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, password } = await request.json();

    // Map fields to match the backend user schema
    const name = `${firstName} ${lastName}`.trim();
    const role = "customer"; // Default role

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
    
    // Call the backend create-user endpoint
    const response = await fetch(`${backendUrl}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || "Signup failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: data.data,
    });
  } catch (error: any) {
    console.error("Signup route handler error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
