import assert from 'node:assert';
import { TOP_50_JOB_PORTALS, buildAggregatorSearchUrls, filterJobsByMaxAgeMinutes } from '../lib/portal-aggregators.mjs';

// 1. Verify Top 50 Portals List
assert(TOP_50_JOB_PORTALS.length >= 50, `Expected at least 50 job portals, got ${TOP_50_JOB_PORTALS.length}`);

// Verify core popular aggregators exist
const portalIds = TOP_50_JOB_PORTALS.map(p => p.id);
assert(portalIds.includes('linkedin'), 'LinkedIn missing');
assert(portalIds.includes('indeed'), 'Indeed missing');
assert(portalIds.includes('ziprecruiter'), 'ZipRecruiter missing');
assert(portalIds.includes('glassdoor'), 'Glassdoor missing');
assert(portalIds.includes('dice'), 'Dice missing');
assert(portalIds.includes('wellfound'), 'Wellfound missing');

// 2. Verify Search URL Builder
const searchUrls = buildAggregatorSearchUrls('AI Engineer', 'all', 60);
assert(searchUrls.length >= 50);

const linkedinSearch = searchUrls.find(s => s.portalId === 'linkedin');
assert(linkedinSearch.url.includes('linkedin.com/jobs/search'));
assert(linkedinSearch.url.includes('f_TPR=r3600')); // 1 hour parameter

// 3. Verify Minute-Level Freshness Filter
const mockJobs = [
  { title: 'Job 10m', postingAgeMinutes: 10 },
  { title: 'Job 45m', postingAgeMinutes: 45 },
  { title: 'Job 90m', postingAgeMinutes: 90 },
  { title: 'Job 180m', postingAgeMinutes: 180 },
];

const fresh60m = filterJobsByMaxAgeMinutes(mockJobs, 60);
assert.strictEqual(fresh60m.length, 2);
assert.strictEqual(fresh60m[0].title, 'Job 10m');
assert.strictEqual(fresh60m[1].title, 'Job 45m');

console.log('✓ test/portal-aggregators.test.mjs passed cleanly!');
