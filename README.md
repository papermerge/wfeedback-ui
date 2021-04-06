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

    $ make build

To toggle minified/not minified versions of the files use NODE_ENV environment variable:

    $ NODE_ENV=development make build  # build development version of the assets
    $ NODE_ENV=production make build  # build production version of the assets

2. Launch local project to see led_status in action:

    $ cd site
    $ ./run.sh

point browser to http://localhost:5000/ web address.

## Build JS Bundle

To create the javascript bundle with webpack, run:

    $ npx webpack ./src/js/led_status.js

JS bundle will be saved in `dist/leds.bundle.js` file.
Same thing can be achieved with:

    $ make build


## Run Tests

    $ make test