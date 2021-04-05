import _ from "underscore";
import $ from "jquery";
import Backbone from "backbone";
import led_unknown_svg from '../assets/led-unknown.svg';
import led_pending_svg from '../assets/led-pending.svg';
import led_in_progress_svg from '../assets/led-in-progress.svg';
import led_success_svg from '../assets/led-success.svg';
import led_fail_svg from '../assets/led-fail.svg';


const OCRDOCUMENT_RECEIVED = 'ocrdocument.received'
const OCRDOCUMENT_STARTED = 'ocrdocument.started'
const OCRDOCUMENT_SUCCEEDED = 'ocrdocument.succeeded'
const OCRDOCUMENT_FAILED = 'ocrdocument.failed'


let default_config = {
    'node_selector': '.node',
    'led_selector': '.led',
    'use_sockets': true
}

export class LEDDocumentStatus {

    constructor(dispatcher, config={}) {
        /**
        `distapcher` is Backbone.Events class used as events trigger.
            You can send "leds.document" type events.

        `config` is a dictionary with following keys:
            * 'node_selector' default value '.node'
            * 'led_selector'  default value '.led'
            * 'use_socket'    default value false    
        **/
        let host, ws_url, that=this;

        if (_.isEmpty(dispatcher)) {
            dispatcher = _.clone(Backbone.Events);
        }
        this._config = Object.assign(default_config, config)
        this._dispatcher = dispatcher;
        this._dispatcher.on("leds.document", this.on_update, this);

        if (this._config['use_sockets']) { 
            ws_url = this.get_ws_url(window.location);

            this._socket = new WebSocket(ws_url);
            this._socket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                that._dispatcher.trigger("leds.document", data);
            };
        }
    }

    get_ws_url(window_location) {
        /**
        Builds web sockets url.

        `window_location` is an instance of window.location object

        If current connection (window.location) is over http://,
        ws_url will use ws:// prefix.
        If current connection (window.location) is over https://,
        ws_url will use wss:// prefix.
        */
        let host = window_location.host,
            proto = window_location.protocol,
            path = 'ws/document';

        if (proto == 'http:') {
            return `ws://${host}/${path}`;
        }

        return `wss://${host}/${path}`;
    }

    _send(message) {
        let that = this;

        if (this._socket) {
            this._socket.onopen = function() {
               that._socket.send(JSON.stringify(message)); 
            }
        }
    }

    pull(document_id) {
        /*
        Sends via websocket 'ocrdocument.pull' message to the server.

        'ocrdocument.pull' message basically asks server to send to the
        client current document status (of the `document_id`).
        */
        let message, that=this;

        message = {
            'document_id': document_id,
            'type': 'ocrdocument.pull'
        }
        this._send(message);
    }

    on_update(message) {
        /*
        Message is a dictionary with following keys:
            * type
            * document_id
            * user_id
        Where type can have one of following string values:
            * ocrdocument.received
            * ocrdocument.started
            * ocrdocument.succeeded
        */
        let led_doc;

        if (_.isEmpty(message)) {
            return ;
        }
        this.update(message);
    }

    update(message) {
        /*
        Message is a dictionary with following keys:
            * type
            * document_id
            * user_id
        Where type can have one of following string values:
            * ocrdocument.received
            * ocrdocument.started
            * ocrdocument.succeeded
        */
        let $dom_node = this.find_node(message);

        if ($dom_node) {
            this.update_state($dom_node, message);
        }
    }

    find_node(message) {
        /*
        Message is a dictionary with following keys:
            * type
            * document_id
            * user_id
        Where type can have one of following string values:
            * ocrdocument.received
            * ocrdocument.started
            * ocrdocument.succeeded
        */
        let doc_node, nodes, selector, document_id;

        document_id = message['document_id'];
        selector = this._config['node_selector'];
        doc_node = $(`${selector}[data-id='${document_id}']`);
        /*
        console.log(
            `Node selector = ${selector}[data-id='${document_id}'], count=${doc_node.length}`
        );
        */
        
        return doc_node;
    }

    update_state($dom_node, message) {
        let $led_elem, css_selector, message_type;

        if (_.isEmpty($dom_node)) {
            console.error("LEDStatus: empty node element");
            return;
        }

        css_selector = this._config['led_selector']
        $led_elem = $dom_node.find(css_selector);

        message_type = message['type'];

        if (_.isEmpty($led_elem)) {
            console.error("LEDStatus: empty led status element");
            return;
        }

        if (message_type == OCRDOCUMENT_RECEIVED) {
            $led_elem.html(led_pending_svg);
        } else if (message_type == OCRDOCUMENT_STARTED) {
            $led_elem.html(led_in_progress_svg);
        } else if (message_type == OCRDOCUMENT_SUCCEEDED) {
            $led_elem.html(led_success_svg);
        } else if (message_type == OCRDOCUMENT_FAILED) {
            $led_elem.html(led_fail_svg);
        }
    }
}


export class LEDPageStatus {

    constructor(dispatcher, config={}) {
        let host, ws_url, that=this;

        if (_.isEmpty(dispatcher)) {
            dispatcher = _.clone(Backbone.Events);
        }
        if (_.isEmpty(config)) {
            config = {
                'node_selector': '.node',
                'led_selector': '.led' // led selector within node
            };
        }

        this._dispatcher = dispatcher;
        this._config = config;
        this._dispatcher.on("leds.page", this.on_update, this);

        host = window.location.host;
        ws_url = `ws://${host}/ws/page`;

        this._socket = new WebSocket(ws_url);
        this._socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            that._dispatcher.trigger("leds.page", data);
        };
    }

    on_update(message) {
        let led_doc;

        if (_.isEmpty(message)) {
            return ;
        }
        console.log(message);
        //this.update(message['document_data'], message['ocr_state']);
    }

    update(doc_data, ocr_state) {

        let $dom_node = this.find_node(doc_data);

        if ($dom_node) {
            this.update_state($dom_node, ocr_state);
        }
    }

    find_node(doc_data) {
        let doc_node, nodes, selector, document_id;

        document_id = doc_data['document_id'];
        selector = this._config['node_selector'];
        doc_node = $(`${selector}[data-id='${document_id}']`);
        /*
        console.log(
            `Node selector = ${selector}[data-id='${document_id}'], count=${doc_node.length}`
        );
        */
        
        return doc_node;
    }

    update_state($dom_node, ocr_state) {
        let $led_elem, state, result, css_selector;

        if (_.isEmpty($dom_node)) {
            console.error("LEDStatus: empty node element");
            return;
        }

        css_selector = this._config['led_selector']
        $led_elem = $dom_node.find(css_selector);

        if (_.isEmpty($led_elem)) {
            console.error("LEDStatus: empty led status element");
            return;
        }

        //console.log(`Found count ${ $led_elem.length } led elements`);

        state = ocr_state['state'];
        result = ocr_state['result']

        //console.log(`state=${state}`)

        if (state == OCR_START) {
            // green blinking
            $led_elem.removeClass(LED_CLASSES);
            $led_elem.addClass([GREEN, BLINK])
        }

        if (state == OCR_COMPLETE && result == SUCCESS) {
            // green static
            $led_elem.removeClass(LED_CLASSES);
            $led_elem.addClass([GREEN])
        }

        if (state == OCR_COMPLETE && result == ERROR) {
            // red static
            $led_elem.removeClass(LED_CLASSES);
            $led_elem.addClass([RED])
        }
    }
}
