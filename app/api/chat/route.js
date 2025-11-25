import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const ASSISTANT_ID = process.env.ASSISTANCE_ID;

export async function POST(req) {
  const { message, threadId } = await req.json();

  const thread = threadId
    ? { id: threadId }
    : await client.beta.threads.create();

  if (!thread?.id) {
    return NextResponse.json({ error: "Thread not created" }, { status: 500 });
  }

  await client.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });
  let run = await client.beta.threads.runs.create(thread.id, {
    assistant_id: ASSISTANT_ID,
  });
  while (["queued", "in_progress"].includes(run.status)) {
    await new Promise((res) => setTimeout(res, 1000));
    run = await client.beta.threads.runs.retrieve(run.id, {
      thread_id: thread.id,
    });
  }
  const messages = await client.beta.threads.messages.list(thread.id, {
    order: "desc",
    limit: 1,
  });
  const reply = messages.data[0].content[0].text.value;
  return NextResponse.json({
    reply,
    threadId: thread.id,
  });
}
