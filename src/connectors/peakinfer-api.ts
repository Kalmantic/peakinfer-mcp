/**
 * PeakInfer API Connector
 *
 * Calls POST https://peakinfer.com/api/analyze with code files
 * for comprehensive 4D analysis (cost, latency, throughput, reliability).
 *
 * Auth modes:
 * - Bearer pk_live_xxx (PeakInfer token, costs credits)
 * - X-Anthropic-Api-Key sk-ant-xxx (BYOK mode, free)
 */

const DEFAULT_API_URL = 'https://peakinfer.com/api/analyze';

export interface AnalysisFile {
  path: string;
  content: string;
}

export interface AnalysisOptions {
  fixes?: boolean;
  benchmark?: boolean;
  outputFormat?: string;
}

export interface InferencePoint {
  id: string;
  file: string;
  line: number;
  provider: string;
  model: string;
  patterns: {
    streaming?: boolean;
    batching?: boolean;
    retry?: boolean;
    fallback?: boolean;
    timeout?: boolean;
    caching?: boolean;
    async?: boolean;
    max_tokens?: boolean;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    type: string;
    message: string;
    impact?: string;
    fix?: string;
  }>;
  confidence: number;
}

export interface AnalysisResult {
  success: boolean;
  version: string;
  inference_points: InferencePoint[];
  summary: {
    files_scanned: number;
    total_callsites: number;
    providers: Record<string, number>;
    models: Record<string, number>;
    critical_issues: number;
    warnings: number;
    opportunities: number;
  };
  insights: Array<{
    type: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    affected_files: string[];
  }>;
  optimizations: Array<{
    priority: number;
    issue: string;
    fix: string;
    impact: string;
    effort: string;
    files: string[];
    code_before?: string;
    code_after?: string;
  }>;
  benchmarks?: Array<{
    model: string;
    metric: string;
    benchmark_value: number;
    estimated_value?: number;
    gap_percent?: number;
  }>;
  credits_used?: number;
  error?: string;
  error_code?: string;
}

export class PeakInferAPIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'PeakInferAPIError';
  }
}

export async function analyzeViaAPI(params: {
  files: AnalysisFile[];
  token?: string;
  anthropicKey?: string;
  options?: AnalysisOptions;
}): Promise<AnalysisResult> {
  const { files, token, anthropicKey, options } = params;
  const apiUrl = process.env.PEAKINFER_API_URL || DEFAULT_API_URL;

  // Build auth headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (anthropicKey) {
    headers['X-Anthropic-Api-Key'] = anthropicKey;
  } else {
    throw new PeakInferAPIError(
      'No authentication configured. Set PEAKINFER_API_TOKEN or ANTHROPIC_API_KEY.',
      'NO_AUTH'
    );
  }

  const body = JSON.stringify({
    files,
    options: {
      fixes: options?.fixes ?? true,
      benchmark: options?.benchmark ?? true,
      output_format: options?.outputFormat ?? 'json',
    },
  });

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(120_000), // 2 minute timeout
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new PeakInferAPIError('API request timed out after 120s', 'TIMEOUT');
    }
    throw new PeakInferAPIError(
      `Failed to connect to PeakInfer API: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'NETWORK_ERROR'
    );
  }

  if (!response.ok) {
    let errorBody: { error?: string; code?: string } = {};
    try {
      errorBody = await response.json() as typeof errorBody;
    } catch {
      // Ignore JSON parse errors
    }

    const code = errorBody.code || `HTTP_${response.status}`;
    const message = errorBody.error || response.statusText;

    if (response.status === 401) {
      throw new PeakInferAPIError('Invalid API token. Check your PEAKINFER_API_TOKEN.', 'INVALID_TOKEN', 401);
    }
    if (response.status === 402 || code === 'CREDIT_EXHAUSTED') {
      throw new PeakInferAPIError(
        'PeakInfer credits exhausted. Add credits at peakinfer.com/dashboard or use BYOK mode with ANTHROPIC_API_KEY.',
        'CREDIT_EXHAUSTED',
        402
      );
    }
    if (response.status === 429 || code === 'RATE_LIMITED') {
      throw new PeakInferAPIError('Rate limited. Wait a moment and try again.', 'RATE_LIMITED', 429);
    }

    throw new PeakInferAPIError(message, code, response.status);
  }

  const result = await response.json() as AnalysisResult;
  return result;
}
