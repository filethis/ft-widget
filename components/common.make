SHELL := /bin/bash

export AWS_ACCESS_KEY_ID=AKIAJP3TORFRST6MH75Q
export AWS_SECRET_ACCESS_KEY=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
export AWS_DEFAULT_REGION=us-west-2


serve-dev:  ## Start serving project and open in browser with live update
	@open -a "Google Chrome" http://localhost:8000/components/${NAME}/dev/index.html; \
	npx web-dev-server \
	--node-resolve \
	--app-index index.html \
	--root-dir ../../ \
	--watch;

	# @npx web-dev-server \
	# 	--node-resolve \
	# 	--watch \
	# 	--root-dir ../../ \
	# 	--open components/${NAME}/dev/index.html


# Production - Component

dist-clean:  ## Clean the component distributable
	@rm -rf dist/component

dist-build:  ## Build the component distributable
	@npx rollup  --config ./rollup.config.js

dist-deploy:  ## Deploy component distributable to CDN
	@aws s3 sync ./dist/component s3://${PUBLICATION_DOMAIN}/${NAME}/component/${VERSION}/;
	aws s3 sync ./dist/component s3://${PUBLICATION_DOMAIN}/${NAME}/component/${VERSION}/;
	make dist-invalidate; \
	make dist-url;

dist-invalidate:  ## Invalidate component distributable on CDN
	@aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/component/${VERSION}/*"; \
	aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/component/latest/*";

dist-url:  ## Print the distributed app URL
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/component/${VERSION}/${NAME}.js; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/component/latest/${NAME}.js;


# Production - Dev/Demo/Fixture

dist-clean-dev:  ## Clean the dev distributable
	@rm -rf dist/

dist-build-dev:  ## Build the dev distributable
	@npx rollup  --config ./dev/rollup.config.js

dist-serve-dev:  ## Serve the dev distributable locally
	@npx web-dev-server --app-index ./dev/dist/index.html --open

dist-deploy-dev:  ## Deploy dev distributable to CDN
	@aws s3 sync ./dist s3://${PUBLICATION_DOMAIN}/${NAME}/dev/${VERSION}/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/dev/${VERSION}/index.html;

dist-invalidate-dev:  ## Invalidate dev distributable on CDN
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; \
		then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; \
		else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/dev/*"; \
	fi

dist-url-dev:  ## Print the dev distributable URL
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/dev/${VERSION}/index.html;


#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
