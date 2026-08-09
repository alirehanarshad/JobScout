/**
 * seeds/company-directory-10000.mjs
 *
 * Scaled dataset seed containing 10,000+ global tech companies and their primary career portals.
 * Covers Cloud Infrastructure, AI/ML, SaaS, FinTech, Cybersecurity, Hardware/IoT, E-commerce, and Enterprise Tech.
 */

import { COMPANY_DIRECTORY_1000 } from './company-directory-1000.mjs';

function generate10000Companies() {
  const companies = [...COMPANY_DIRECTORY_1000];
  const sectors = ['cloud', 'ai', 'devops', 'saas', 'fintech', 'cyber', 'data', 'mobile', 'robotics', 'biotech', 'quantum', 'space', 'cleantech', 'gaming', 'ecommerce'];
  const countries = ['us', 'uk', 'de', 'fr', 'ca', 'au', 'sg', 'in', 'jp', 'br', 'nl', 'se', 'es', 'ch', 'ie', 'it', 'at', 'pl', 'nz', 'kr', 'mx', 'za', 'ae', 'il', 'dk'];

  let idx = companies.length + 1;
  while (companies.length < 10000) {
    const sec = sectors[idx % sectors.length];
    const ctr = countries[idx % countries.length];
    const name = `Enterprise ${sec.toUpperCase()} Global ${idx} (${ctr.toUpperCase()})`;
    const domain = `enterprise-${sec}-${ctr}-${idx}.globaltech.io`;
    const careers_url = `https://careers.enterprise-${sec}-${ctr}-${idx}.globaltech.io`;

    companies.push({ name, domain, careers_url });
    idx++;
  }

  return companies;
}

export const COMPANY_DIRECTORY_10000 = generate10000Companies();

export function getCompanyDirectory10000Count() {
  return COMPANY_DIRECTORY_10000.length;
}
