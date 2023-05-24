const localImages = require('eleventy-plugin-local-images');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css/Site.css");
	eleventyConfig.addPassthroughCopy("scripts/Site.js");
    eleventyConfig.addPassthroughCopy("scripts/nav.js");
    eleventyConfig.addPassthroughCopy("nav.html");
    eleventyConfig.addPassthroughCopy("contact.html");
    eleventyConfig.addPassthroughCopy("pens.html");
    eleventyConfig.addPassthroughCopy("scripts/index.js");
    eleventyConfig.addPassthroughCopy("css/index.css");
    eleventyConfig.addPassthroughCopy("hobbies.html");
    eleventyConfig.addPassthroughCopy("css/pens.css");
    eleventyConfig.addPassthroughCopy("css/hobbies.css");
    eleventyConfig.addPassthroughCopy("scripts/pens.js");
    eleventyConfig.addPassthroughCopy("scripts/hobbies.js");
    eleventyConfig.addPlugin(localImages, {
        distPath: '_site',
        assetPath: '/img',
        selector: 'img',
        verbose: false
      });
};