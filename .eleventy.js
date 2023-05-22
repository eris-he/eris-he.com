module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css/Site.css");
	eleventyConfig.addPassthroughCopy("scripts/Site.js");
};