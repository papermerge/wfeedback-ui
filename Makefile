test:
	npm run-script test
	npx mocha test-dist/tests.bundle.js --require source-map-support/register

build:
	npm run-script build
