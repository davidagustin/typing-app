// Lightweight regex-based syntax highlighter that maps each character to a color.
// Works across all supported languages by targeting universal patterns.

const COLORS = {
  keyword: "#c678dd",
  string: "#98c379",
  number: "#d19a66",
  comment: "#5c6370",
  function: "#61afef",
  type: "#e5c07b",
  operator: "#56b6c2",
  punctuation: "#abb2bf",
  default: "#abb2bf",
};

// Common keywords across major languages
const KEYWORDS = new Set([
  // Control flow
  "if", "else", "elif", "elsif", "for", "while", "do", "switch", "case",
  "break", "continue", "return", "yield", "match", "when", "then", "end",
  "loop", "foreach", "unless", "until", "repeat",
  // Declarations
  "function", "func", "fn", "def", "fun", "sub", "proc", "method",
  "class", "struct", "enum", "trait", "impl", "interface", "protocol",
  "type", "typealias", "typedef", "newtype", "data", "record",
  "module", "package", "namespace", "import", "export", "from", "use",
  "require", "include", "using", "open", "qualified", "hiding",
  "const", "let", "var", "val", "mut", "auto", "static", "final",
  "lazy", "volatile", "register", "extern", "inline",
  // Access
  "public", "private", "protected", "internal", "pub", "open", "sealed",
  // OOP
  "new", "delete", "this", "self", "super", "extends", "implements",
  "abstract", "virtual", "override", "default",
  // Async
  "async", "await", "go", "chan", "select", "defer", "spawn",
  // Error handling
  "try", "catch", "finally", "throw", "throws", "raise", "rescue",
  "ensure", "except", "panic", "recover",
  // Logical
  "and", "or", "not", "in", "is", "as", "of",
  // Types / values
  "void", "null", "nil", "undefined", "true", "false", "True", "False",
  "None", "bool", "int", "float", "double", "char", "string", "byte",
  "long", "short", "signed", "unsigned", "size_t",
  // Other
  "where", "with", "guard", "deriving", "instance", "forall",
  "typeof", "instanceof", "sizeof", "alignof",
  "template", "typename", "concept", "requires", "constexpr",
  "move", "ref", "dyn", "box", "unsafe", "macro",
  "begin", "rescue", "ensure", "pass", "global", "nonlocal",
  "lambda", "closure",
  // Rust
  "crate", "mod", "pub", "impl", "trait", "where", "dyn",
  // Go
  "range", "make", "append", "len", "cap", "fallthrough", "iota",
  // Ruby
  "attr_accessor", "attr_reader", "attr_writer", "puts", "gets",
  // Preprocessor-like
  "define", "undef", "ifdef", "ifndef", "endif", "pragma", "include",
]);

interface TokenRegion {
  start: number;
  end: number;
  color: string;
}

export function getSyntaxColors(code: string): string[] {
  const colors = new Array<string>(code.length).fill(COLORS.default);
  const regions: TokenRegion[] = [];

  // 1. Strings (triple-quoted, double, single, backtick)
  const stringPatterns = [
    /"""[\s\S]*?"""/g,
    /'''[\s\S]*?'''/g,
    /`(?:[^`\\]|\\.)*`/g,
    /"(?:[^"\\]|\\.)*"/g,
    /'(?:[^'\\]|\\.)*'/g,
  ];
  for (const pattern of stringPatterns) {
    let m;
    while ((m = pattern.exec(code)) !== null) {
      regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.string });
    }
  }

  // 2. Comments
  const commentPatterns = [
    /\/\/.*$/gm,
    /\/\*[\s\S]*?\*\//g,
    /<!--[\s\S]*?-->/g,
    /#(?![!\[])[^\n]*/gm,
    /--(?!>)[^\n]*/gm,
    /;;[^\n]*/gm,
    /%[^\n]*/gm,
  ];
  for (const pattern of commentPatterns) {
    let m;
    while ((m = pattern.exec(code)) !== null) {
      regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.comment });
    }
  }

  // 3. Numbers
  const numberPattern = /\b(?:0x[0-9a-fA-F][0-9a-fA-F_]*|0b[01][01_]*|0o[0-7][0-7_]*|\d[\d_]*\.?\d*(?:[eE][+-]?\d+)?)[a-zA-Z]?\b/g;
  let m;
  while ((m = numberPattern.exec(code)) !== null) {
    regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.number });
  }

  // 4. Types (PascalCase identifiers)
  const typePattern = /\b[A-Z][a-zA-Z0-9_]*\b/g;
  while ((m = typePattern.exec(code)) !== null) {
    if (!KEYWORDS.has(m[0])) {
      regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.type });
    }
  }

  // 5. Function calls (word followed by parenthesis)
  const funcPattern = /\b([a-zA-Z_]\w*)\s*(?=\()/g;
  while ((m = funcPattern.exec(code)) !== null) {
    const name = m[1];
    if (!KEYWORDS.has(name)) {
      regions.push({ start: m.index, end: m.index + name.length, color: COLORS.function });
    }
  }

  // 6. Keywords
  const wordPattern = /\b[a-zA-Z_]\w*\b/g;
  while ((m = wordPattern.exec(code)) !== null) {
    if (KEYWORDS.has(m[0])) {
      regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.keyword });
    }
  }

  // 7. Operators
  const opPattern = /===|!==|==|!=|<=|>=|=>|->|::|&&|\|\||<<|>>|\.\.\.|\.\.|\+\+|--|[+\-*/%=<>!&|^~?]/g;
  while ((m = opPattern.exec(code)) !== null) {
    regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.operator });
  }

  // 8. Punctuation (brackets, braces, parens, commas, semicolons, dots)
  const punctPattern = /[(){}\[\];,.:#@]/g;
  while ((m = punctPattern.exec(code)) !== null) {
    regions.push({ start: m.index, end: m.index + m[0].length, color: COLORS.punctuation });
  }

  // Apply regions in priority order (first added = highest priority)
  // Use a "painted" array to avoid overwriting higher-priority tokens
  const painted = new Uint8Array(code.length);
  for (const region of regions) {
    for (let i = region.start; i < region.end && i < code.length; i++) {
      if (!painted[i]) {
        colors[i] = region.color;
        painted[i] = 1;
      }
    }
  }

  return colors;
}
