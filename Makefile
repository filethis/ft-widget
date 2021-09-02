SHELL := /bin/bash

NAME=ft-widget

export AWS_ACCESS_KEY_ID=XXXX
export AWS_SECRET_ACCESS_KEY=XXXX
export AWS_DEFAULT_REGION=us-west-2


include common.make


# Package dependency managementdisallow-zircon-ruff

npm-install:  ## Install all packages
	@npm install

npm-clean:  ## Delete all packages
	@rm -rf node_modules/

npm-prune:  ## Prune all "extraneous" (unused) packages
	@npm prune

npm-prune-dry-run:
	@npm prune --dry-run
	

# Development

serve:  ## Serve the application locally for development work
	@open -a "Google Chrome" http://localhost:8000/index.html; \
	npx web-dev-server \
	--node-resolve \
	--app-index index.html \
	--watch;

serve-pasted:  ## Serve index file copied out of SDK and pasted into test-index.html
	@open -a "Google Chrome" http://localhost:8000/pasted-index.html; \
	npx web-dev-server \
	--node-resolve \
	--app-index pasted-index.html \
	--watch;


# Production 

dist-clean:  ## Clean the distributable
	@rm -rf dist/

dist-build:  ## Build the distributable
	@npx rollup --config

dist-serve:  ## Serve the distributable locally
	@open -a "Google Chrome" http://localhost:8000/dist/index.html; \
	npx web-dev-server \
		--app-index dist/index.html \
		--watch;

dist-serve-old:
	@npx web-dev-server --app-index dist/index.html --open

dist-deploy:  ## Deploy distributable to CDN
	@aws s3 sync ./dist s3://${PUBLICATION_DOMAIN}/${NAME}/app/${VERSION}/; \
	aws s3 sync ./dist s3://${PUBLICATION_DOMAIN}/${NAME}/app/latest/; \
	make dist-invalidate-latest; \
	make dist-url;

dist-invalidate-latest:  ## Invalidate latest app distributable on CDN
	@aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/app/latest/*";

dist-invalidate-versioned:  ## Invalidate versioned app distributable on CDN
	@aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/app/${VERSION}/*";

dist-invalidate-all:  ## Invalidate all versions of app distributable on CDN
	@aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/app/*";

dist-url:  ## Print the distributed app URL
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/app/${VERSION}/index.html; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/app/latest/index.html;

dist-open:  ## Open the distributed app URL in a browser
	@open -a "Google Chrome" https://${PUBLICATION_DOMAIN}/${NAME}/app/${VERSION}/index.html;


# Help

help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
