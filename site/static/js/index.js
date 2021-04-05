$(function(){

    let events, config, ls;

    events = _.clone(Backbone.Events);
    config = {
        'node_selector': '.node',
        'led_selector': '.led', // led selector within node
        'use_sockets': false
    };
    ls = new LEDS.LEDDocumentStatus(events, config);

    $("button#apply").click(function(){
        let document_id, state, result, message;
        
        document_id = $("#document-selector").val();
        state = $('#document-state').val();

        message = {
            "document_id": document_id,
            "type": state
        }

        events.trigger(
            "leds.document", message
        );

    });
});