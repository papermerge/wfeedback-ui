import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";

import { LEDDocumentStatus } from "./js/led_status";

$(function(){

    let events, config, led_status;

    events = _.clone(Backbone.Events);
    config = {
        'node_selector': '.node',
        'led_selector': '.led' // led selector within node
    };
    led_status = new LEDDocumentStatus(events, config);

    $("button#apply").click(function(){
        let folder_id, state;

        document_id = $("#document-selector").val();
        state = $('#document-state').val();
        result = $('#document-result').val();

        message = {
            "document_data": {
                "document_id": document_id
            },
            "ocr_state": {
                "state": state,
                "result": result
            }
        }
        events.trigger(
            "leds.document", message);

    });

    
});