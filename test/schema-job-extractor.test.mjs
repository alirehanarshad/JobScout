import assert from 'node:assert';
import { parsePostingAgeMinutes, extractSchemaJobsFromHtml } from '../lib/schema-job-extractor.mjs';

// 1. Test parsePostingAgeMinutes
const now = new Date('2026-08-09T02:00:00Z');

// Exact minute relative string
assert.strictEqual(parsePostingAgeMinutes('15 mins ago', now), 15);
assert.strictEqual(parsePostingAgeMinutes('45 minutes ago', now), 45);
assert.strictEqual(parsePostingAgeMinutes('1 hour ago', now), 60);

// ISO string
assert.strictEqual(parsePostingAgeMinutes('2026-08-09T01:30:00Z', now), 30);
assert.strictEqual(parsePostingAgeMinutes('2026-08-09T01:00:00Z', now), 60);

// Just now
assert.strictEqual(parsePostingAgeMinutes('Just now', now), 1);

// 2. Test extractSchemaJobsFromHtml
const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Senior AI Systems Engineer",
  "datePosted": "2026-08-09T01:45:00Z",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Anthropic"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  },
  "description": "We are seeking a Senior AI Systems Engineer..."
}
</script>
</head>
<body><h1>Job Details</h1></body>
</html>
`;

const jobs = extractSchemaJobsFromHtml(sampleHtml, 'https://example.com/job/123');
assert.strictEqual(jobs.length, 1);
assert.strictEqual(jobs[0].title, 'Senior AI Systems Engineer');
assert.strictEqual(jobs[0].company, 'Anthropic');
assert.strictEqual(jobs[0].location, 'San Francisco, CA, US');
assert.strictEqual(jobs[0].datePosted, '2026-08-09T01:45:00Z');
assert(typeof jobs[0].postingAgeMinutes === 'number' || jobs[0].postingAgeMinutes === null);

console.log('✓ test/schema-job-extractor.test.mjs passed cleanly!');
