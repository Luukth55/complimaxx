import { GoogleGenAI, Type } from "@google/genai";
import { AuditPackage } from "../types";

// Enhanced Schema with stricter requirements for AI stability
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
          decision_points: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                decision: { type: Type.STRING },
                yes_action: { type: Type.STRING },
                no_action: { type: Type.STRING },
              },
            },
          },
          approvals_required: { type: Type.ARRAY, items: { type: Type.STRING } },
          lead_time: { type: Type.STRING },
          dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          owner: { type: Type.STRING },
          linked_key_controls: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    raci_matrix: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          process_step: { type: Type.STRING },
          roles: {
            type: Type.OBJECT,
            properties: {
              admin: { type: Type.STRING },
              qa: { type: Type.STRING },
              it: { type: Type.STRING },
              analyst: { type: Type.STRING },
              audit: { type: Type.STRING }
            },
          },
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
          linked_controls: { type: Type.ARRAY, items: { type: Type.STRING } },
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
          frequency: { type: Type.STRING },
          owner: { type: Type.STRING },
          automation_level: { type: Type.STRING },
          evidence_required: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    control_objectives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          linked_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          linked_controls: { type: Type.ARRAY, items: { type: Type.STRING } },
          success_criteria: { type: Type.STRING },
        },
      },
    },
    key_controls: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          control_id: { type: Type.STRING },
          reason: { type: Type.STRING },
          test_frequency: { type: Type.STRING },
        },
      },
    },
    test_plans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          control_id: { type: Type.STRING },
          purpose: { type: Type.STRING },
          reviewer: { type: Type.STRING },
          sampling_frequency: { type: Type.STRING },
          evidence_required: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          pass_fail_criteria: { type: Type.STRING },
        },
      },
    },
    evidence_checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          linked_control: { type: Type.STRING },
          mandatory: { type: Type.BOOLEAN },
          file_type: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.STRING },
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
  },
  required: [
    "process_flow",
    "raci_matrix",
    "risks",
    "controls",
    "control_objectives",
    "key_controls",
    "test_plans",
    "evidence_checklist",
    "audit_score",
    "framework_mapping"
  ]
};

export const generateAuditPackage = async (
  processName: string,
  processDescription: string,
  frameworks: string[]
): Promise<AuditPackage> => {
  // Always use `new GoogleGenAI({apiKey: process.env.API_KEY});` as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `You are a world-class Chief Audit Executive and GRC Architect.
  Your task is to generate a comprehensive, enterprise-grade audit package in JSON format.
  Use formal, professional language. 
  Ensure all IDs (R-01, C-01, etc.) are consistently cross-referenced across risks, controls, and test plans.
  RACI must have exactly 1 'A' (Accountable) per step.`;

  const prompt = `Generate a full audit package for the process: "${processName}".
    
    FRAMEWORKS TO ALIGN WITH: ${frameworks.join(', ')}.
    BUSINESS CONTEXT: ${processDescription}

    REQUIRED COMPONENTS:
    1. process_flow: 5-7 logical steps with risks and decision points.
    2. raci_matrix: Responsibility assignment for each step.
    3. risks: Inherent vs Residual ratings.
    4. controls: Specific, verifiable controls mapped to frameworks.
    5. key_controls: Critical controls that require testing.
    6. test_plans: How to audit the key controls.
    7. evidence_checklist: Specific artifacts needed (logs, screenshots, policies).
    8. audit_score: Benchmark the current design readiness.
    9. framework_mapping: Map controls to specific framework articles/references.
  `;

  try {
    // Using 'gemini-3-pro-preview' for complex text tasks involving reasoning and logic.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: auditPackageSchema,
        temperature: 0.1, 
      },
    });

    // Access .text property directly as it returns string | undefined
    const text = response.text;
    if (!text) throw new Error("The AI engine returned an empty response.");

    try {
        return JSON.parse(text) as AuditPackage;
    } catch (parseError) {
        console.error("JSON Parsing Error:", text);
        throw new Error("AI output was not a valid JSON. Please try again with a simpler description.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('fetch')) {
      throw new Error("Network error connecting to AI. Please check your connection.");
    }
    throw error;
  }
};