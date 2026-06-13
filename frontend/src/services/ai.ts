import { apiClient } from "@/lib/axios";
import type { AIQueryRequest, AIQueryResponse } from "@/types";

/** Send a natural-language inventory question to the AI assistant */
export async function queryAI(data: AIQueryRequest): Promise<AIQueryResponse> {
  const res = await apiClient.post("/ai/query", data);

  return res.data;
}
