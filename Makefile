install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

server:
	NODE_ENV=development npx webpack serve

test:
	npm test