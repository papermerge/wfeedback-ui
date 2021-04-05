import { assert } from "chai";

import _ from "underscore";
import Backbone from "backbone";

import { LEDDocumentStatus } from '../src/js/led_status.js';


describe("Basic test suite", function() {
  it("can instanciate LEDDocumentStatus", function() {
    let dispatcher = _.clone(Backbone.Events);;

    let doc_status = new LEDDocumentStatus(dispatcher, {'use_sockets': false});

    assert.isDefined(doc_status);
  });
});
