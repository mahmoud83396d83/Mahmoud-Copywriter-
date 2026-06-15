import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

async function callAI(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.AI_API_KEY || "sk-dummy-key";
  const apiEndpoint = process.env.AI_API_ENDPOINT || "https://api.moonshot.cn/v1/chat/completions";

  const systemPrompt = `You are Mahmoud's AI assistant on his portfolio website. You help visitors learn about his services including copywriting, content strategy, AI-powered writing, digital marketing, and script writing. You can answer in both Arabic and English. Be professional, friendly, and concise. If asked about pricing, suggest contacting Mahmoud directly via WhatsApp at +201211303375 or email at mahmoudbedox@gmail.com. If asked about services, mention: Content Writing, Digital Marketing, AI Solutions, and Script Writing.`;

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // Fallback response when AI API is not available
      const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
      const isArabic = /[\u0600-\u06FF]/.test(lastUserMessage);

      if (isArabic) {
        return `شكراً لتواصلك! أنا مساعد محمود الذكي. يمكنني مساعدتك في معرفة المزيد عن خدمات محمود في الكتابة الإبداعية، التسويق الرقمي، حلول الذكاء الاصطناعي، وكتابة السيناريو. للاستفسارات المفصلة أو طلب عرض سعر، تواصل مع محمود مباشرة على واتساب: +201211303375 أو البريد: mahmoudbedox@gmail.com`;
      }
      return `Thank you for reaching out! I'm Mahmoud's AI assistant. I can help you learn more about Mahmoud's services in creative writing, digital marketing, AI solutions, and script writing. For detailed inquiries or pricing, contact Mahmoud directly via WhatsApp: +201211303375 or email: mahmoudbedox@gmail.com`;
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || "I'm here to help! What would you like to know about Mahmoud's services?";
  } catch {
    const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
    const isArabic = /[\u0600-\u06FF]/.test(lastUserMessage);

    if (isArabic) {
      return `شكراً لتواصلك! أنا مساعد محمود الذكي. يمكنني مساعدتك في معرفة المزيد عن خدمات محمود في الكتابة الإبداعية، التسويق الرقمي، حلول الذكاء الاصطناعي، وكتابة السيناريو. للاستفسارات المفصلة أو طلب عرض سعر، تواصل مع محمود مباشرة على واتساب: +201211303375 أو البريد: mahmoudbedox@gmail.com`;
    }
    return `Thank you for reaching out! I'm Mahmoud's AI assistant. I can help you learn more about Mahmoud's services in creative writing, digital marketing, AI solutions, and script writing. For detailed inquiries or pricing, contact Mahmoud directly via WhatsApp: +201211303375 or email: mahmoudbedox@gmail.com`;
  }
}

export const chatRouter = createRouter({
  createSession: publicQuery
    .input(z.object({ title: z.string().optional() }).optional())
    .mutation(async ({ input }) => {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      await getDb()
        .insert(schema.chatSessions)
        .values({
          sessionId,
          title: input?.title || "New Chat",
        });

      return { sessionId };
    }),

  send: publicQuery
    .input(
      z.object({
        message: z.string().min(1),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      let sessionId = input.sessionId;

      // Create session if not provided
      if (!sessionId) {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await getDb()
          .insert(schema.chatSessions)
          .values({
            sessionId: newSessionId,
            title: input.message.slice(0, 50),
          });
        sessionId = newSessionId;
      }

      // Get existing session
      const sessions = await getDb()
        .select()
        .from(schema.chatSessions)
        .where(eq(schema.chatSessions.sessionId, sessionId))
        .limit(1);

      if (sessions.length === 0) {
        await getDb()
          .insert(schema.chatSessions)
          .values({
            sessionId,
            title: input.message.slice(0, 50),
          });
      }

      // Save user message
      const dbSession = sessions[0] || await getDb()
        .select()
        .from(schema.chatSessions)
        .where(eq(schema.chatSessions.sessionId, sessionId))
        .limit(1)
        .then(r => r[0]);

      await getDb()
        .insert(schema.chatMessages)
        .values({
          sessionId: dbSession.id,
          role: "user",
          content: input.message,
        });

      // Get chat history for context
      const history = await getDb()
        .select()
        .from(schema.chatMessages)
        .where(eq(schema.chatMessages.sessionId, dbSession.id))
        .orderBy(schema.chatMessages.createdAt)
        .limit(10);

      const messages = history.map((h) => ({
        role: h.role,
        content: h.content,
      }));

      // Call AI
      const reply = await callAI(messages);

      // Save assistant message
      await getDb()
        .insert(schema.chatMessages)
        .values({
          sessionId: dbSession.id,
          role: "assistant",
          content: reply,
        });

      // Update session timestamp
      await getDb()
        .update(schema.chatSessions)
        .set({ updatedAt: new Date() })
        .where(eq(schema.chatSessions.id, dbSession.id));

      return { reply, sessionId };
    }),

  getHistory: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const sessions = await getDb()
        .select()
        .from(schema.chatSessions)
        .where(eq(schema.chatSessions.sessionId, input.sessionId))
        .limit(1);

      if (sessions.length === 0) return [];

      return getDb()
        .select()
        .from(schema.chatMessages)
        .where(eq(schema.chatMessages.sessionId, sessions[0].id))
        .orderBy(schema.chatMessages.createdAt);
    }),
});
