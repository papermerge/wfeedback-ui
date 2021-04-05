# LED Status Indicators

LED statuses provide visual feedback for various background tasks like document/page OCR.

## Project Structure

Project contains following folders:

* src - source code of the package
* dist - distribution + bundled version of the package
* site - local project (flask based) used as demo of usage + documentation

## Usage

A mini flask based web application is provided in site folder. Its goal is to
run led_status outside of Papermerge.

1. First build js/css distribution files with:

    $ gulp


2. Launch local project to see led_status in action:

    $ cd site
    $ ./run.sh

point browser to http://localhost:5000/ web address.

## Build JS Bundle

To create the javascript bundle with webpack, run:

    $ npx webpack ./src/js/led_status.js

JS bundle will be saved in `dist/leds.bundle.js` file.

Same effect can be achieved with following command:

    $ npm run-script build

Or

    $ make build


## Run Tests

    $ npm run-script test
    $ npx mocha test-dist/tests.bundle.js

You can run test suite using one command:

    $ make test