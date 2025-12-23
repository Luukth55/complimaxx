
// @google/genai guidelines:
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// Use 'gemini-3-pro-preview' for complex text tasks.
// Always use import {GoogleGenAI} from "@google/genai";
// Do not use SchemaType; Correct Type.

import { GoogleGenAI, Type } from "@google/genai";
import { AuditPackage } from "../types";

// Schema Definitions matching the TypeScript interfaces
// Note: Schema object follows standard structure but we use any or infer type for the variable 
// to avoid importing internal types not explicitly allowed by the guidelines.
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
              audit: { type: Type.STRING },
              role1: { type: Type.STRING },
              role2: { type: Type.STRING },
              role3: { type: Type.STRING }
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
  // Fix: Strictly following initialization guidelines for GoogleGenAI with named parameter and direct process.env.API_KEY usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert Chief Audit Executive (CAE) and Enterprise Compliance Architect.
    Generate a professional audit-grade package for: "${processName}".
    
    FRAMEWORKS: ${frameworks.join(', ')}.
    CONTEXT: ${processDescription}

    OUTPUT SPECIFICATIONS:
    1. Process Flow: Granular steps (5-8) with risk hotspots.
    2. RACI Matrix: Strictly 1 Accountable per step.
    3. Risks: 8-10 high-impact compliance/operational risks.
    4. Controls: 10-15 strong controls mapped to Framework sections.
    5. Test Plans: Detailed audit steps for Key Controls.
    6. Evidence: Checklist of artifacts (logs, policies, screenshots).

    Language must be formal, precise, and professional. Ensure all IDs (C01, R01, E01) are cross-referenced correctly.
  `;

  try {
    // Guidelines: Use 'gemini-3-pro-preview' for complex text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: auditPackageSchema,
        thinkingConfig: { thinkingBudget: 4096 },
        temperature: 0.1, 
      },
    });

    // Guidelines: Access response.text directly as a property.
    const text = response.text;
    if (!text) throw new Error("No response from AI engine.");

    const parsedData = JSON.parse(text) as AuditPackage;
    return parsedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Analysis engine encountered a structural error. Try a simpler process description.");
    }
    throw error;
  }
};
