import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const pipelinePath = join(process.cwd(), 'data', 'pipeline.md');
const shortlistPath = join(process.cwd(), 'data', 'shortlist.md');
const appsPath = join(process.cwd(), 'data', 'applications.md');

const content = readFileSync(pipelinePath, 'utf-8');
const lines = content.split('\n');

const pendingLines = lines.filter(line => line.startsWith('- [ ]'));

const roles = [];

// Keywords for Cloud, IoT, and AI fit scoring
const hotKeywords = [
  'cloud', 'iot', 'aiot', 'edge', 'embedded', 'firmware', 'sensors', 'ai', 'ml', 'llm',
  'platform', 'kubernetes', 'aws', 'azure', 'gcp', 'devops', 'systems engineer', 'architect',
  'infrastructure', 'telemetry', 'vector', 'rag'
];

for (const line of pendingLines) {
  // Format: - [ ] <url> | <company> | <title> | <location> | posted: <date>
  const parts = line.replace('- [ ] ', '').split(' | ');
  if (parts.length >= 3) {
    const url = parts[0].trim();
    const company = parts[1].trim();
    const title = parts[2].trim();
    const location = parts[3] ? parts[3].trim() : 'Remote / Unspecified';
    const posted = parts[4] ? parts[4].trim() : '';

    const textToMatch = (title + ' ' + company).toLowerCase();
    let score = 3.0; // Base score

    // Calculate Cloud, IoT & AI fit score
    if (textToMatch.includes('cloud') || textToMatch.includes('aws') || textToMatch.includes('gcp') || textToMatch.includes('azure')) score += 0.5;
    if (textToMatch.includes('iot') || textToMatch.includes('edge') || textToMatch.includes('embedded') || textToMatch.includes('firmware') || textToMatch.includes('sensor')) score += 0.7;
    if (textToMatch.includes('ai') || textToMatch.includes('ml') || textToMatch.includes('llm') || textToMatch.includes('genai')) score += 0.5;
    if (textToMatch.includes('platform') || textToMatch.includes('architect') || textToMatch.includes('infrastructure')) score += 0.3;

    if (score > 5.0) score = 5.0;

    roles.push({ url, company, title, location, posted, score, line });
  }
}

// Sort roles by highest score first
roles.sort((a, b) => b.score - a.score);

const worthALook = roles.filter(r => r.score >= 4.0);
const maybe = roles.filter(r => r.score >= 3.5 && r.score < 4.0);
const skip = roles.filter(r => r.score < 3.5);

let shortlistMd = `# CareerOps Shortlist -- Cloud, IoT & AI Roles

Total Pending Listings Evaluated: ${roles.length}
Hot Roles Found (Score >= 4.0/5): ${worthALook.length}

## 🔥 Hottest Roles (Worth a Look - Score 4.0+)
${worthALook.map(r => `- **[${r.score.toFixed(1)}/5.0]** ${r.company} -- **${r.title}** (${r.location}) [Apply/View](${r.url})`).join('\n')}

## ⚡ Secondary Roles (Maybe - Score 3.5-3.9)
${maybe.slice(0, 30).map(r => `- **[${r.score.toFixed(1)}/5.0]** ${r.company} -- ${r.title} (${r.location}) [Apply/View](${r.url})`).join('\n')}
`;

writeFileSync(shortlistPath, shortlistMd);

console.log(`✅ Evaluated ${roles.length} roles!`);
console.log(`🔥 Hottest Roles (Score 4.0+): ${worthALook.length}`);
console.log(`📄 Shortlist saved to data/shortlist.md`);
