const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { expect } = require('chai');

describe('Performance Tests', () => {
  let chrome;
  let results;

  before(async () => {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port
    };

    results = await lighthouse('http://localhost:3000', options);
  });

  after(() => {
    chrome.kill();
  });

  it('should have good performance score', () => {
    expect(results.lhr.categories.performance.score).to.be.above(0.9);
  });

  it('should have good accessibility score', () => {
    expect(results.lhr.categories.accessibility.score).to.be.above(0.9);
  });

  it('should have good best practices score', () => {
    expect(results.lhr.categories['best-practices'].score).to.be.above(0.9);
  });

  it('should have good SEO score', () => {
    expect(results.lhr.categories.seo.score).to.be.above(0.9);
  });
});