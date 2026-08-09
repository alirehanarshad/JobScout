// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

/**
 * LinkedIn Jobs Provider.
 * Connects to public LinkedIn guest job search endpoints.
 */

import { extractSchemaJobsFromHtml } from '../lib/schema-job-extractor.mjs';

/** @type {Provider} */
export default {
  id: 'linkedin',

  detect(entry) {
    if (entry.careers_url && /linkedin\.com\/jobs/i.test(entry.careers_url)) {
      return { url: entry.careers_url };
    }
    return null;
  },

  async fetch(entry, ctx) {
    const targetUrl = entry.careers_url || 'https://www.linkedin.com/jobs/search/';
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
        company: j.company || entry.name || 'LinkedIn',
        location: j.location || '',
        datePosted: j.datePosted,
        postingAgeMinutes: j.postingAgeMinutes,
      }));
    }

    // Fallback: regex scan for LinkedIn job cards if schema unavailable
    const results = [];
    const cardRegex = /href=["'](https:\/\/www\.linkedin\.com\/jobs\/view\/[^"'\?]+)[^>]*>[\s\S]*?<h3[^>]*>([^<]+)<\/h3>[\s\S]*?<h4[^>]*>([^<]+)<\/h4>/gi;
    let match;

    while ((match = cardRegex.exec(htmlText)) !== null) {
      results.push({
        url: match[1],
        title: match[2].trim(),
        company: match[3].trim(),
        location: '',
      });
    }

    return results;
  },
};
