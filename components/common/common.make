SHELL := /bin/bash

serve:  ## Start serving project and open in browser with live update
	@npx web-dev-server \
		--node-resolve \
		--watch \
		--root-dir ../../ \
		--open components/${NAME}/dev/index.html


# Production 

dist-clean:  ## Clean the distributable
	@rm -rf dist/

dist-build:  ## Build the distributable
	@npx rollup  --config ./dev/rollup.config.js

dist-serve:  ## Serve the distributable locally
	@npx web-dev-server --app-index ./dev/dist/index.html --open

dist-deploy:  ## Deploy distributable to CDN
	@aws s3 sync ./dist s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/app/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/app/index.html;

dist-invalidate:  ## Invalidate distributable on CDN
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; \
		then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; \
		else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/app/*"; \
	fi


#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
