// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

/**
 * Dice Tech Job Provider.
 * Fetches public tech postings from Dice.
 */

import { extractSchemaJobsFromHtml } from '../lib/schema-job-extractor.mjs';

/** @type {Provider} */
export default {
  id: 'dice',

  detect(entry) {
    if (entry.careers_url && /dice\.com/i.test(entry.careers_url)) {
      return { url: entry.careers_url };
    }
    return null;
  },

  async fetch(entry, ctx) {
    const targetUrl = entry.careers_url || 'https://www.dice.com/jobs';
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
      company: j.company || entry.name || 'Dice',
      location: j.location || '',
      datePosted: j.datePosted,
      postingAgeMinutes: j.postingAgeMinutes,
    }));
  },
};
