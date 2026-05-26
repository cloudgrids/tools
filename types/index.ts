// ── Types ────────────────────────────────────────────────────
export interface Tool {
  id: string;
  icon: string;
  name: string;
  desc: string;
  category: ToolCategory;
  keywords: string[];
}

export type ToolCategory = "formatters" | "generators" | "converters" | "utilities";

export interface ColorStop {
  color: string;
  pos: number;
}

export interface GradientConfig {
  type: "linear" | "radial" | "conic";
  angle: number;
  stops: ColorStop[];
}

export interface HashResult {
  algorithm: string;
  hash: string;
  bits: number;
}

export interface DiffLine {
  type: "add" | "remove" | "equal";
  content: string;
  lineA?: number;
  lineB?: number;
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: (string | undefined)[];
}

export interface ContrastResult {
  ratio: number;
  aaSmall: boolean;
  aaLarge: boolean;
  aaaSmall: boolean;
  aaaLarge: boolean;
}

export interface JwtPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  valid: boolean;
}
