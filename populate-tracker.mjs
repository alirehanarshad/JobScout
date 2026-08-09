import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const appsPath = join(process.cwd(), 'data', 'applications.md');

const dateToday = new Date().toISOString().split('T')[0];

const hotRoles = [
  { company: 'Wayve', role: 'Senior Cloud SRE - AI/ML Platform & GPU Compute', score: '4.3', location: 'London', url: 'https://wayve.firststage.co/jobs?gh_jid=8458272002' },
  { company: '1dea', role: 'Staff Cloud Security Architect (AI / Azure / Terraform)', score: '4.3', location: 'Warszawa', url: 'https://solid.jobs/o/xnvuqxix/career-ops' },
  { company: 'SumUp', role: 'Engineering Manager - Edge AI', score: '4.2', location: 'Berlin, Germany', url: 'https://sumup.com/careers/positions/8530960002?gh_jid=8530960002' },
  { company: 'Palantir', role: 'Software Engineer - Edge AI Systems', score: '4.2', location: 'Seattle, WA', url: 'https://jobs.lever.co/palantir/67110929-adea-41c3-851a-8882e222d9e4' },
  { company: 'Deepgram', role: 'Embedded AI Engineer, On-Device Models', score: '4.2', location: 'USA / Remote', url: 'https://jobs.ashbyhq.com/deepgram/0b7494b3-a91e-4540-9439-5b10a1e5b391' },
  { company: 'Arize AI', role: 'Cloud & AI Technology Partner Manager', score: '4.0', location: 'Remote (US)', url: 'https://job-boards.greenhouse.io/arizeai/jobs/5995824004' },
  { company: 'Celonis', role: 'Senior Manager Cloud & AI Partnerships', score: '4.0', location: 'New York, NY', url: 'https://job-boards.greenhouse.io/celonis/jobs/7721677003?gh_jid=7721677003' },
  { company: 'Legora', role: 'Director, Cloud & AI Partnerships', score: '4.0', location: 'New York City', url: 'https://jobs.ashbyhq.com/legora/d107905d-b2ef-4964-834b-a17d6e93e971' },
  { company: '1dea', role: 'Senior Machine Learning Engineer (GenAI / GCP)', score: '4.0', location: 'Warszawa', url: 'https://solid.jobs/o/eoougc9j/career-ops' },
  { company: 'Be in IT', role: 'AWS Senior Data LLM Engineer', score: '4.0', location: 'Warszawa', url: 'https://solid.jobs/o/p2oqr01g/career-ops' },
  { company: 'Wayve', role: 'Embedded Automotive Platforms Software Engineer', score: '4.0', location: 'London', url: 'https://wayve.firststage.co/jobs?gh_jid=8585251002' },
  { company: 'Wayve', role: 'Engineering Manager, Embedded Automotive Platform', score: '4.0', location: 'Sunnyvale', url: 'https://wayve.firststage.co/jobs?gh_jid=8554492002' },
  { company: 'CYCLAD', role: 'AI Engineer (Java/ GCP)', score: '4.0', location: 'Kraków', url: 'https://solid.jobs/o/u1zpq21k/career-ops' },
  { company: 'Palantir', role: 'Edge Infrastructure Engineer', score: '4.0', location: 'Warsaw, Poland', url: 'https://jobs.lever.co/palantir/3d06b4bc-6a7b-4f73-b5c5-4544354e3d0f' },
  { company: 'adobe', role: 'Senior Product Manager, Data Platform - Knowledge & Retrieval', score: '4.0', location: 'San Jose', url: 'https://adobe.wd5.myworkdayjobs.com/external_experienced/job/San-Jose/Senior-Product-Manager--Data-Platform---Knowledge---Retrieval_R170844-1' },
  { company: 'Deepgram', role: 'Platform Engineer - AI/ML Infrastructure (Kubernetes & Terraform)', score: '3.8', location: 'USA / Remote', url: 'https://jobs.ashbyhq.com/deepgram/f424ef6a-c27f-4984-9e77-40a1ad16ae28' }
];

let mdContent = `# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
`;

hotRoles.forEach((item, index) => {
  const num = (index + 1).toString().padStart(3, '0');
  mdContent += `| ${num} | ${dateToday} | ${item.company} | ${item.role} | ${item.score} | Shortlisted | - | - | [Posting](${item.url}) - ${item.location} |\n`;
});

writeFileSync(appsPath, mdContent);
console.log(`✅ Populated ${hotRoles.length} applications into data/applications.md`);
