import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPresignedUpload } from "@/lib/s3";
import { presignRequestSchema } from "@/lib/validations/upload";

export async function POST(request: NextRequest) {
  const { data: session } = await auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = presignRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await createPresignedUpload(parsed.data.contentType, parsed.data.folder);

  return NextResponse.json(result);
}
