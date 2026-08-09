// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

/**
 * Indeed Provider.
 * Fetches public job postings and extracts structured metadata.
 */

import { extractSchemaJobsFromHtml } from '../lib/schema-job-extractor.mjs';

/** @type {Provider} */
export default {
  id: 'indeed',

  detect(entry) {
    if (entry.careers_url && /indeed\.com/i.test(entry.careers_url)) {
      return { url: entry.careers_url };
    }
    return null;
  },

  async fetch(entry, ctx) {
    const targetUrl = entry.careers_url || 'https://www.indeed.com/jobs?q=software&fromage=1';
    let htmlText = '';

    try {
      if (typeof ctx.fetchText === 'function') {
        htmlText = await ctx.fetchText(targetUrl);
      } else {
        const resp = await ctx.fetchJson(targetUrl);
        htmlText = typeof resp === 'string' ? resp : JSON.stringify(resp);
      }
    } catch {
      return [];
    }

    const schemaJobs = extractSchemaJobsFromHtml(htmlText, targetUrl);
    if (schemaJobs.length > 0) {
      return schemaJobs.map(j => ({
        title: j.title,
        url: j.url,
        company: j.company || entry.name || 'Indeed',
        location: j.location || '',
        datePosted: j.datePosted,
        postingAgeMinutes: j.postingAgeMinutes,
      }));
    }

    return [];
  },
};
