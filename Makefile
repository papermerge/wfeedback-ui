test:
	TESTBUILD=true npx webpack
	npx mocha test-dist/tests.bundle.js --require source-map-support/register

clean:
	rm -fr test-dist/

build:
	npx webpack --config webpack.config.js