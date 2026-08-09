import assert from 'node:assert';
import { TOP_10000_JOB_PORTALS, buildAggregatorSearchUrls } from '../lib/portal-aggregators.mjs';
import { COMPANY_DIRECTORY_10000, getCompanyDirectory10000Count } from '../seeds/company-directory-10000.mjs';

// 1. Verify 10,000 Portals Registry
assert(TOP_10000_JOB_PORTALS.length >= 10000, `Expected at least 10,000 portals, got ${TOP_10000_JOB_PORTALS.length}`);
console.log(`✓ TOP_10000_JOB_PORTALS verified: ${TOP_10000_JOB_PORTALS.length} active job portals loaded.`);

// Verify search query builder for a target portal
const sampleQueryUrls = buildAggregatorSearchUrls('Cloud Architect', 'linkedin', 60);
assert.strictEqual(sampleQueryUrls.length, 1);
assert.strictEqual(sampleQueryUrls[0].portalId, 'linkedin');
console.log(`✓ Search Query Builder verified.`);

// 2. Verify 10,000 Company Websites Seed Directory
const count = getCompanyDirectory10000Count();
assert(count >= 10000, `Expected at least 10,000 seeded companies, got ${count}`);
assert(COMPANY_DIRECTORY_10000.every(c => c.name && c.domain && c.careers_url));
console.log(`✓ COMPANY_DIRECTORY_10000 verified: ${count} company career websites ready.`);

console.log('✓ test/expanded-10000-portals.test.mjs passed cleanly!');
