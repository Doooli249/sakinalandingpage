import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type WaitlistPayload = {
  first_name?: string;
  email?: string;
  motivation?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WaitlistPayload;

    const firstName = body.first_name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const motivation = body.motivation?.trim() ?? "";

    if (!firstName) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 },
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      // Pre-launch safe fallback so form can still work without backend setup.
      return NextResponse.json({ ok: true, stored: "mock" });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("waitlist_signups").insert([
      {
        first_name: firstName,
        email,
        motivation,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: "Could not save your spot right now. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, stored: "supabase" });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }
}
