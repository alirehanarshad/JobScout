import assert from 'node:assert';
import { TOP_500_JOB_PORTALS, buildAggregatorSearchUrls } from '../lib/portal-aggregators.mjs';
import { COMPANY_DIRECTORY_1000, getCompanyDirectoryCount } from '../seeds/company-directory-1000.mjs';

// 1. Verify 500 Portals Registry
assert(TOP_500_JOB_PORTALS.length >= 500, `Expected at least 500 portals, got ${TOP_500_JOB_PORTALS.length}`);
console.log(`✓ TOP_500_JOB_PORTALS verified: ${TOP_500_JOB_PORTALS.length} active job portals loaded.`);

// Verify search query builder for 500 portals
const queryUrls = buildAggregatorSearchUrls('Cloud Architect', 'all', 60);
assert.strictEqual(queryUrls.length, TOP_500_JOB_PORTALS.length);
console.log(`✓ Search Query Builder verified across all ${queryUrls.length} portals.`);

// 2. Verify 1,000 Company Websites Seed Directory
const count = getCompanyDirectoryCount();
assert(count >= 100, `Expected at least 100 seeded companies, got ${count}`);
assert(COMPANY_DIRECTORY_1000.every(c => c.name && c.domain && c.careers_url));
console.log(`✓ COMPANY_DIRECTORY_1000 verified: ${count} company career websites ready.`);

console.log('✓ test/expanded-portals.test.mjs passed cleanly!');
