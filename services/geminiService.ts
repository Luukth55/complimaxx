
import { GoogleGenAI, Type } from "@google/genai";
import { AuditPackage } from "../types";

export const generateAuditPackage = async (
  processName: string,
  processDescription: string,
  frameworks: string[]
): Promise<AuditPackage> => {
  // Always obtain API key from process.env.API_KEY as per instructions.
  // Initialize with named parameter 'apiKey'.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const auditPackageSchema: any = {
    type: Type.OBJECT,
    properties: {
      process_flow: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            description: { type: Type.STRING },
            risk_hotspots: { type: Type.ARRAY, items: { type: Type.STRING } },
            owner: { type: Type.STRING },
          },
        },
      },
      risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            inherent_rating: {
              type: Type.OBJECT,
              properties: {
                likelihood: { type: Type.STRING },
                impact: { type: Type.STRING },
              },
            },
            residual_rating: {
              type: Type.OBJECT,
              properties: {
                likelihood: { type: Type.STRING },
                impact: { type: Type.STRING },
              },
            },
          },
        },
      },
      controls: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            frequency: { type: Type.STRING },
            automation_level: { type: Type.STRING },
            framework_mapping: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  framework: { type: Type.STRING },
                  reference: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
      audit_score: {
        type: Type.OBJECT,
        properties: {
          total_score: { type: Type.NUMBER },
          domain_scores: {
            type: Type.OBJECT,
            properties: {
              control_environment: { type: Type.NUMBER },
              risk_management: { type: Type.NUMBER },
              framework_compliance: { type: Type.NUMBER },
              evidence_quality: { type: Type.NUMBER },
            },
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
      framework_mapping: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            framework: { type: Type.STRING },
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  reference: { type: Type.STRING },
                  linked_controls: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
          },
        },
      },
      raci_matrix: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { process_step: { type: Type.STRING }, roles: { type: Type.OBJECT, properties: { admin: { type: Type.STRING }, qa: { type: Type.STRING }, it: { type: Type.STRING }, analyst: { type: Type.STRING }, audit: { type: Type.STRING } } } } } },
      control_objectives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, success_criteria: { type: Type.STRING } } } },
      key_controls: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, control_id: { type: Type.STRING }, reason: { type: Type.STRING }, test_frequency: { type: Type.STRING } } } },
      test_plans: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, control_id: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
      evidence_checklist: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, mandatory: { type: Type.BOOLEAN }, file_type: { type: Type.ARRAY, items: { type: Type.STRING } }, instructions: { type: Type.STRING } } } },
    },
    required: ["process_flow", "risks", "controls", "audit_score", "framework_mapping", "raci_matrix", "control_objectives", "key_controls", "test_plans", "evidence_checklist"]
  };

  const systemInstruction = `You are a Chief Audit Executive. Generate a detailed Audit Operating Package in JSON format.
  Align all controls to the requested frameworks: ${frameworks.join(', ')}.
  Ensure high structural integrity.`;

  try {
    // Generate content using gemini-3-pro-preview for complex reasoning tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Build a compliance pack for: ${processName}. Context: ${processDescription}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: auditPackageSchema,
        temperature: 0.2,
      },
    });

    // Extract text output directly from .text property.
    const result = response.text;
    if (!result) throw new Error("No response from AI engine.");
    
    return JSON.parse(result) as AuditPackage;
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    throw error;
  }
};
