// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

/**
 * ZipRecruiter Provider.
 * Fetches public ZipRecruiter job search postings.
 */

import { extractSchemaJobsFromHtml } from '../lib/schema-job-extractor.mjs';

/** @type {Provider} */
export default {
  id: 'ziprecruiter',

  detect(entry) {
    if (entry.careers_url && /ziprecruiter\.com/i.test(entry.careers_url)) {
      return { url: entry.careers_url };
    }
    return null;
  },

  async fetch(entry, ctx) {
    const targetUrl = entry.careers_url || 'https://www.ziprecruiter.com/candidate/search';
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
    return schemaJobs.map(j => ({
      title: j.title,
      url: j.url,
      company: j.company || entry.name || 'ZipRecruiter',
      location: j.location || '',
      datePosted: j.datePosted,
      postingAgeMinutes: j.postingAgeMinutes,
    }));
  },
};
