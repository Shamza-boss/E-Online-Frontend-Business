import fs from "fs";
import path from "path";

const root = "c:/Users/shammah.nhlabathi/Documents/E-Online-Frontend-Business";

function patch(rel, edits) {
  const file = path.join(root, rel);
  let s = fs.readFileSync(file, "utf8");
  for (const [from, to] of edits) {
    if (!s.includes(from)) {
      console.error("MISSING in", rel, ":", JSON.stringify(from.slice(0, 100)));
      process.exitCode = 1;
      continue;
    }
    s = s.replace(from, to);
  }
  fs.writeFileSync(file, s, "utf8");
  console.log("patched", rel);
}

patch("src/app/_lib/utils/textbook.ts", [
  [`  if (linked.length === 1) {
    const c = linked[0];
    const grade = c.academicLevelName ? \`\${c.academicLevelName} \u00b7 \` : '';
    return \`\${grade}\${c.name}\`;
  }`, `  if (linked.length === 1) {
    const c = linked[0];
    if (!c) return 'Not linked to a course';
    const grade = c.academicLevelName ? \`\${c.academicLevelName} \u00b7 \` : '';
    return \`\${grade}\${c.name}\`;
  }`],
  ["  if (linked.length === 1) return linked[0].name;", `  if (linked.length === 1) {
    const classroom = linked[0];
    return classroom?.name ?? 'Not linked';
  }`],
]);
