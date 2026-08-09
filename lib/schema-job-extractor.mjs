/**
 * lib/schema-job-extractor.mjs
 *
 * Universal web scraper for schema.org/JobPosting microdata & JSON-LD.
 * Extracts structured job data and publication timestamps from arbitrary web pages.
 */

import { decodeEntities } from '../providers/_html-entities.mjs';

/**
 * Parses publication date/timestamp string into age in minutes.
 * Accepts ISO dates ("2026-08-09T01:30:00Z"), Unix timestamps, and relative time expressions
 * such as "15 mins ago", "30 minutes ago", "1 hour ago", "Just now".
 *
 * @param {string|number} dateStr - Date string or timestamp
 * @param {Date} [now=new Date()] - Reference execution date
 * @returns {number|null} Age in minutes, or null if unparseable
 */
export function parsePostingAgeMinutes(dateStr, now = new Date()) {
  if (!dateStr) return null;

  if (typeof dateStr === 'number') {
    const diffMs = now.getTime() - dateStr;
    return diffMs >= 0 ? Math.floor(diffMs / 60000) : 0;
  }

  const s = String(dateStr).trim().toLowerCase();

  if (s.includes('just now') || s.includes('moment ago') || s.includes('few seconds')) {
    return 1;
  }

  // Relative time expressions: e.g. "15 minutes ago", "20m ago", "1 hour ago", "2 hrs ago"
  const minMatch = s.match(/(\d+)\s*(?:m|min|mins|minute|minutes)\s*(?:ago)?/);
  if (minMatch) {
    return parseInt(minMatch[1], 10);
  }

  const hrMatch = s.match(/(\d+)\s*(?:h|hr|hrs|hour|hours)\s*(?:ago)?/);
  if (hrMatch) {
    return parseInt(hrMatch[1], 10) * 60;
  }

  const dayMatch = s.match(/(\d+)\s*(?:d|day|days)\s*(?:ago)?/);
  if (dayMatch) {
    return parseInt(dayMatch[1], 10) * 1440;
  }

  // Try standard Date parsing
  const parsedDate = Date.parse(dateStr);
  if (!isNaN(parsedDate)) {
    const diffMs = now.getTime() - parsedDate;
    return diffMs >= 0 ? Math.floor(diffMs / 60000) : null;
  }

  return null;
}

/**
 * Extracts schema.org/JobPosting JSON-LD & meta objects from raw HTML text.
 *
 * @param {string} htmlText - Raw HTML source code of page
 * @param {string} pageUrl - Fallback source URL
 * @returns {Array<Object>} List of normalized job postings found
 */
export function extractSchemaJobsFromHtml(htmlText, pageUrl = '') {
  if (!htmlText || typeof htmlText !== 'string') return [];

  const jobs = [];

  // 1. Extract JSON-LD script blocks
  const scriptRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(htmlText)) !== null) {
    const content = match[1].trim();
    if (!content) continue;

    try {
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (!item) continue;
        if (item['@type'] === 'JobPosting' || item['@type']?.includes?.('JobPosting')) {
          const extracted = normalizeJobPostingObject(item, pageUrl);
          if (extracted) jobs.push(extracted);
        } else if (item['@graph'] && Array.isArray(item['@graph'])) {
          for (const graphNode of item['@graph']) {
            if (graphNode['@type'] === 'JobPosting' || graphNode['@type']?.includes?.('JobPosting')) {
              const extracted = normalizeJobPostingObject(graphNode, pageUrl);
              if (extracted) jobs.push(extracted);
            }
          }
        }
      }
    } catch {
      // Ignore malformed JSON-LD scripts
    }
  }

  // 2. Fallback: Microdata / Meta tag extraction if no JSON-LD JobPosting found
  if (jobs.length === 0) {
    const metaJob = extractMetaFallback(htmlText, pageUrl);
    if (metaJob) jobs.push(metaJob);
  }

  return jobs;
}

/**
 * Normalizes a raw schema.org/JobPosting JSON-LD object.
 */
function normalizeJobPostingObject(obj, defaultUrl = '') {
  if (!obj || typeof obj !== 'object') return null;

  const title = decodeEntities(obj.title || obj.name || '').trim();
  if (!title) return null;

  let company = '';
  if (typeof obj.hiringOrganization === 'string') {
    company = obj.hiringOrganization;
  } else if (obj.hiringOrganization?.name) {
    company = obj.hiringOrganization.name;
  }
  company = decodeEntities(company).trim();

  let location = '';
  if (typeof obj.jobLocation === 'string') {
    location = obj.jobLocation;
  } else if (Array.isArray(obj.jobLocation)) {
    location = obj.jobLocation
      .map(loc => formatLocationObj(loc))
      .filter(Boolean)
      .join('; ');
  } else if (obj.jobLocation) {
    location = formatLocationObj(obj.jobLocation);
  }
  if (!location && obj.applicantLocationRequirements) {
    location = typeof obj.applicantLocationRequirements === 'string'
      ? obj.applicantLocationRequirements
      : obj.applicantLocationRequirements.name || '';
  }
  location = decodeEntities(location).trim();

  const url = obj.url || defaultUrl;
  const datePosted = obj.datePosted || obj.validFrom || '';
  const description = decodeEntities(obj.description || '').replace(/<[^>]+>/g, ' ').trim();

  return {
    title,
    company: company || 'Unknown',
    location: location || 'Remote / Unspecified',
    url,
    datePosted,
    postingAgeMinutes: parsePostingAgeMinutes(datePosted),
    description,
    raw: obj,
  };
}

function formatLocationObj(loc) {
  if (!loc || typeof loc !== 'object') return '';
  const addr = loc.address;
  if (typeof addr === 'string') return addr;
  if (!addr || typeof addr !== 'object') return loc.name || '';
  const parts = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean);
  return parts.join(', ');
}

/**
 * Fallback meta tag & OpenGraph parser for pages without JSON-LD.
 */
function extractMetaFallback(htmlText, pageUrl) {
  const getMeta = (prop) => {
    const re = new RegExp(`<meta\\s+(?:property|name)=["']${prop}["']\\s+content=["']([^"']+)["']`, 'i');
    const m = htmlText.match(re);
    return m ? decodeEntities(m[1]).trim() : '';
  };

  const title = getMeta('og:title') || getMeta('twitter:title') || extractTagText(htmlText, 'title');
  if (!title || !/job|career|hiring|engineer|developer|manager|specialist|analyst/i.test(title)) {
    return null;
  }

  const company = getMeta('og:site_name') || getMeta('author') || '';
  const description = getMeta('og:description') || getMeta('description') || '';
  const datePosted = getMeta('article:published_time') || getMeta('og:updated_time') || '';

  return {
    title,
    company: company || 'Unknown',
    location: 'Remote / Unspecified',
    url: pageUrl,
    datePosted,
    postingAgeMinutes: parsePostingAgeMinutes(datePosted),
    description,
  };
}

function extractTagText(htmlText, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = htmlText.match(re);
  return m ? decodeEntities(m[1]).replace(/<[^>]+>/g, '').trim() : '';
}
