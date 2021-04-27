SHELL := /bin/bash

open:  ## Open dev page in browser
	@open http://127.0.0.1:8000/dev

serve:  ## Start serving project and open in browser with live update
	@npx es-dev-server --node-resolve --watch --open http://127.0.0.1:8000/dev


#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
