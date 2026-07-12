/**
 * Subject Theme Utility
 * Generates consistent pastel gradients and icon mappings based on subject names.
 * Uses a deterministic hash to ensure the same subject always gets the same colors.
 */

// Beautiful pastel gradient pairs inspired by the Features section
const GRADIENT_PRESETS = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' }, // Purple-violet
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f093fb' }, // Pink-coral
  { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' }, // Blue-cyan
  { gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', accent: '#a8edea' }, // Teal-pink
  { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accent: '#ff9a9e' }, // Salmon-lavender
  { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', accent: '#fa709a' }, // Pink-yellow
  { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', accent: '#a18cd1' }, // Lavender-pink
  { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', accent: '#66a6ff' }, // Cyan-blue
  { gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accent: '#fcb69f' }, // Peach-orange
  { gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', accent: '#a1c4fd' }, // Light blue
  { gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', accent: '#d299c2' }, // Mauve-cream
  { gradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)', accent: '#96e6a1' }, // Green-lime
  { gradient: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)', accent: '#fdcbf1' }, // Pink-gray
  { gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', accent: '#84fab0' }, // Mint-sky
  { gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', accent: '#f6d365' }, // Gold-peach
  { gradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', accent: '#cfd9df' }, // Gray-blue
];

// Subject-specific gradient mappings for common subjects
const SUBJECT_GRADIENT_MAP: Record<string, { gradient: string; accent: string }> = {
  // STEM
  mathematics: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  maths: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  math: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  algebra: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  geometry: { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', accent: '#a18cd1' },
  calculus: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  statistics: { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', accent: '#66a6ff' },
  
  science: { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
  physics: { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
  chemistry: { gradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)', accent: '#96e6a1' },
  biology: { gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', accent: '#84fab0' },
  
  // Computing
  computer: { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', accent: '#66a6ff' },
  programming: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  coding: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  it: { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', accent: '#66a6ff' },
  technology: { gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', accent: '#66a6ff' },
  
  // Languages
  english: { gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', accent: '#f6d365' },
  literature: { gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accent: '#fcb69f' },
  language: { gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', accent: '#f6d365' },
  french: { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
  spanish: { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accent: '#ff9a9e' },
  german: { gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', accent: '#f6d365' },
  afrikaans: { gradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)', accent: '#96e6a1' },
  zulu: { gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', accent: '#84fab0' },
  
  // Arts & Humanities
  art: { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f093fb' },
  music: { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', accent: '#fa709a' },
  drama: { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f093fb' },
  history: { gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accent: '#fcb69f' },
  geography: { gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', accent: '#84fab0' },
  
  // Business & Commerce
  business: { gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', accent: '#a1c4fd' },
  economics: { gradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)', accent: '#96e6a1' },
  accounting: { gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', accent: '#a1c4fd' },
  finance: { gradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)', accent: '#96e6a1' },
  
  // Physical Education
  pe: { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accent: '#ff9a9e' },
  sports: { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accent: '#ff9a9e' },
  physical: { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', accent: '#ff9a9e' },
  
  // Others
  health: { gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', accent: '#84fab0' },
  psychology: { gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', accent: '#a18cd1' },
  philosophy: { gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', accent: '#d299c2' },
  law: { gradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', accent: '#cfd9df' },
};

/**
 * Simple hash function to generate a consistent number from a string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Gets theme colors for a subject name
 * Returns a consistent gradient and accent color based on the subject
 */
export function getSubjectTheme(subjectName: string): { gradient: string; accent: string } {
  const normalizedSubject = subjectName.toLowerCase().trim();
  
  // Check for exact or partial matches in the subject map
  for (const [key, value] of Object.entries(SUBJECT_GRADIENT_MAP)) {
    if (normalizedSubject.includes(key) || key.includes(normalizedSubject)) {
      return value;
    }
  }
  
  // Fall back to hash-based selection for unknown subjects
  const hash = hashString(normalizedSubject);
  const index = hash % GRADIENT_PRESETS.length;
  return GRADIENT_PRESETS[index] ?? GRADIENT_PRESETS[0]!;
}

/**
 * Gets the icon type for a subject (can be used to select appropriate MUI icons)
 */
export type SubjectIconType = 
  | 'calculate' // Math
  | 'science' // Science
  | 'code' // Computing
  | 'translate' // Languages
  | 'palette' // Arts
  | 'history_edu' // History/Humanities
  | 'business' // Business
  | 'fitness' // PE/Sports
  | 'school'; // Default

export function getSubjectIconType(subjectName: string): SubjectIconType {
  const normalizedSubject = subjectName.toLowerCase().trim();
  
  // Math
  if (/math|algebra|geometry|calculus|statistics|trigonometry/.test(normalizedSubject)) {
    return 'calculate';
  }
  
  // Science
  if (/science|physics|chemistry|biology|astronomy/.test(normalizedSubject)) {
    return 'science';
  }
  
  // Computing
  if (/computer|programming|coding|it|technology|software/.test(normalizedSubject)) {
    return 'code';
  }
  
  // Languages
  if (/english|french|spanish|german|language|literature|afrikaans|zulu/.test(normalizedSubject)) {
    return 'translate';
  }
  
  // Arts
  if (/art|music|drama|design|creative/.test(normalizedSubject)) {
    return 'palette';
  }
  
  // History/Humanities
  if (/history|geography|social|civics/.test(normalizedSubject)) {
    return 'history_edu';
  }
  
  // Business
  if (/business|economics|accounting|finance|commerce/.test(normalizedSubject)) {
    return 'business';
  }
  
  // PE/Sports
  if (/pe|sport|physical|fitness|health/.test(normalizedSubject)) {
    return 'fitness';
  }
  
  return 'school';
}
