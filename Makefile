develop:
	npx webpack serve

install:
	npm ci

start:
	npx webpack

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest

lint:
	npx eslint .

.PHONY: test