import _ from "underscore";
import $ from "jquery";

const OCR_START = 'ocr-start';
const OCR_COMPLETE = 'ocr-complete';
const SUCCESS = 'success'
const ERROR = 'error';

const YELLOW = 'led-yellow';
const GREEN = 'led-green';
const RED = 'led-red';
const BLINK = 'blink';

const LED_CLASSES = [
    GREEN, YELLOW, RED, BLINK
]


export class LEDDocumentStatus {

    constructor(dispatcher, config={}) {
        if (_.isEmpty(dispatcher)) {
            console.error("Empty consumer provided");
            return;
        }
        this._dispatcher = dispatcher;
        this._config = config;
        this._dispatcher.on("leds.document", this.on_update, this);
    }

    on_update(message) {
        let led_doc;

        if (_.isEmpty(message)) {
            return ;
        }
        this.update(message['document_data'], message['ocr_state']);
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
