
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AuditPackage } from "../types";

// Schema Definitions matching the TypeScript interfaces
const auditPackageSchema: Schema = {
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
              // Allow flexible keys for dynamic stakeholder roles
              role1: { type: Type.STRING },
              role2: { type: Type.STRING },
              role3: { type: Type.STRING },
              role4: { type: Type.STRING },
              role5: { type: Type.STRING }
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
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Missing API Key. Please configure your API key.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // OPTIMIZED PROMPT: Reduced item counts to prevent JSON truncation
  const prompt = `
    You are an expert Chief Audit Executive (CAE) and Enterprise Compliance Architect.
    Your task is to perform a DEEP ANALYTICAL REVIEW and generate a comprehensive audit package for the process described below.

    TARGET FRAMEWORKS TO APPLY: ${frameworks.join(', ')}.
    
    PROCESS DETAILS:
    Name: ${processName}
    Input Context: ${processDescription}

    --------------------------------------------------------
    ANALYTICAL INSTRUCTIONS (THINK STEP-BY-STEP):
    1. ANALYZE FRAMEWORK REQUIREMENTS: For every selected framework (e.g., ISO 27001, GDPR, SOX), identify the specific clauses that apply to this process.
    2. RISK ASSESSMENT: Use the provided Context (Systems, Purpose, Risks) to identify REALISTIC inherent risks.
    3. CONTROL DESIGN: Design controls that specifically satisfy the requirements of the selected frameworks.
    4. MAPPING: You MUST map every single control to specific sections/articles of the frameworks (e.g., "ISO 27001 A.9.2.1", "GDPR Art. 32").
    --------------------------------------------------------

    OUTPUT SPECIFICATIONS (STRICT JSON):
    
    1. **Process Flow (Pxx)**: 
       - Break down the process into 5-8 logical, granular steps.
       - Identify 'Risk Hotspots' for each step.
    
    2. **RACI Matrix** (STRICT ADHERENCE TO METHODOLOGY): 
       - Columns MUST be ROLES (e.g., Finance Manager, CFO, AI Agent), NOT specific names unless provided in context.
       - Rows must be the Process Steps defined above.
       - **RULES:**
         - EXACTLY ONE 'Accountable' (A) per step. (The decision maker/approver).
         - At least one 'Responsible' (R) per step. (The doer).
         - Use 'C' (Consulted) for subject matter experts who provide input.
         - Use 'I' (Informed) for those notified after the fact.
    
    3. **Risks (Rxx)**: 
       - Generate 8-10 specific, high-impact risks.
       - Categorize them (Operational, Compliance, Financial, IT, Reputational).
    
    4. **Controls (Cxx)**: 
       - Generate 10-15 strong, testable controls.
       - LINK every control to at least one Risk.
       - POPULATE 'framework_mapping' for every control with specific references.
       - POPULATE 'evidence_required' with specific Evidence IDs (Exx) that prove this control is effective.
    
    5. **Control Objectives (COxx)**:
       - Define 3-5 objectives that group risks and controls.
    
    6. **Key Controls (KCxx)**:
       - Select 3-5 critical controls from the main list.
    
    7. **Test Plans (Txx)**:
       - Create detailed test plans for the Key Controls (match the Key Controls count).
       - Step-by-step instructions for an external auditor.
    
    8. **Evidence Checklist (Exx)**:
       - Generate 15-25 specific evidence items (logs, screenshots, policies).
       - Ensure IDs (E01, E02...) are referenced in the Controls 'evidence_required' field.

    9. **Readiness Score**:
       - Calculate a score (0-100) based on how well the controls cover the identified risks and framework requirements.
       - Provide actionable recommendations.

    10. **Framework Mapping**:
       - Summarize the coverage by framework.

    Your output MUST be a valid JSON object matching the schema provided.
    Ensure professional, Audit-Grade imperative language (e.g., "Verify that...", "Ensure segregation of...", "Validate system logs...").
    DO NOT wrap output in markdown code blocks. Return RAW JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: auditPackageSchema,
        thinkingConfig: { thinkingBudget: 2048 }, // Adjusted budget to prevent token starvation for output
        temperature: 0.2, 
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Robust cleaning: Remove markdown code blocks if present (e.g. ```json ... ```)
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    const parsedData = JSON.parse(text) as AuditPackage;

    // Professional Validation Check
    if (!parsedData.process_flow || parsedData.process_flow.length === 0) {
        throw new Error("Generated data incomplete: Missing process flow.");
    }

    return parsedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // If we catch a syntax error, it might be due to truncation.
    if (error instanceof SyntaxError) {
        throw new Error("The analysis was too complex and the response was truncated. Please try reducing the process scope or description.");
    }
    throw error;
  }
};
