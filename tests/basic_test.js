import { assert } from "chai";

import { LEDDocumentStatus } from '../src/js/led_status.js';


describe("A suite", function() {
  it("contains spec with an expectation", function() {
    let doc_status = new LEDDocumentStatus();

    assert.equal(1, 1);
  });
});
