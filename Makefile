install:
	npm install gh-pages && \
	(cd issues-site-generator && npm install)

site: site-issues site-publish

site-issues:
	PATH=$(PATH):`(cd issues-site-generator && npm bin)` issues-site-generator issues site-gen

site-publish:
	PATH=$(PATH):`npm bin` gh-pages -d site-gen
