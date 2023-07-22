const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const includesFilter = require("./blog/includes");

module.exports = (eleventyConfig) => {
    eleventyConfig.addPassthroughCopy("blog/assets/images/");
    eleventyConfig.addPassthroughCopy("blog/assets/css/themes/");
    eleventyConfig.addPassthroughCopy("blog/assets/css/main.css");

    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.addCollection("page", (collections) => {
        return collections.getFilteredByTag("page").sort((a, b) => {
            return a.data.order - b.data.order;
        });
    });

    eleventyConfig.addShortcode(
        "headers",
        (title, subtitle) =>
          `<h1>${title}</h1>
            <p>${subtitle}</p>`
    );

    eleventyConfig.addShortcode(
        "currentDate",
        () => {
            return DateTime.now();
        }
    );

    eleventyConfig.addFilter(
        "postDate",
        (date) => {
            return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
        }
    );

    eleventyConfig.addFilter('imageUrl', (slug, filename) => {
      return `/blog/assets/images/${slug}/${filename}`;
    });

    eleventyConfig.addFilter("urlPrefix", url => {
      return url.startsWith('/blog/') ? url : `/blog/${url}`;
    });

    eleventyConfig.addCollection("sortedNavItems", function(collectionApi) {
      return collectionApi.getFilteredByTag("navitem").sort(function(a, b) {
        return a.data.o - b.data.o;
      });
    });

    eleventyConfig.addFilter('has_tag', includesFilter);

    return {
      dir: {
        input: "blog",
        data: "_data",
        includes: "_includes",
        layouts: "_layouts",
        output: "_site_blog",
        pathPrefix: "/blog/",
      }
    };
  }