import { supabase } from "./supabase";
import type { LLMAnalysisResult } from "../types";

export async function analyzeTaskPhoto(
  photoBase64: string,
  taskName: string,
  criteria: string
): Promise<LLMAnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-photo", {
    body: {
      photo_base64: photoBase64,
      task_name: taskName,
      criteria,
    },
  });

  if (error) {
    console.error("Erro ao analisar foto:", error);
    return {
      aprovado: false,
      feedback: "Não consegui verificar a foto. Tente novamente!",
    };
  }

  return data as LLMAnalysisResult;
}
