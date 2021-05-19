SHELL := /bin/bash

NAME=ft-widget

CDN_DISTRIBUTION_ID=EJ2RMYD38WUXM
PUBLICATION_DOMAIN=connect.filethis.com
VERSION=1.0.4
AWS_VAULT_PROFILE=filethis


# Package dependency management

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
	@npx web-dev-server \
	--node-resolve \
	--watch \
	--open index.html


# Production 

dist-clean:  ## Clean the distributable
	@rm -rf dist/

dist-build:  ## Build the distributable
	@npx rollup -c

dist-serve:  ## Serve the distributable locally
	@npx web-dev-server --app-index dist/index.html --open

dist-deploy:  ## Deploy distributable to CDN
	@aws s3 sync ./dist s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/app/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/app/index.html;

dist-invalidate:  ## Invalidate distributable on CDN
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; \
		then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; \
		else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/app/*"; \
	fi


# Documentation

doc-clean:  ## Clean documentation app
	@rm -rf ./doc;

doc-build:  ## Build documentation app
	@echo doc-build

doc-serve:  ## Serve documentation app
	@echo doc-serve

doc-deploy:  ## Deploy documentation app to CDN
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync ./doc s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/doc/; \
	echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/doc/index.html;

doc-invalidate:  ## Invalidate documentation app on CDN
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; \
		then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; \
		else aws-vault exec ${AWS_VAULT_PROFILE} -- aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/doc/*"; \
	fi

# Help

help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
