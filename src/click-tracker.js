/**
 * Click Tracker
 *
 * @constructor
 * @author dashk
 */
if (typeof(window.ClickTracker) === 'undefined') {
    var global = window,
        CT = global.ClickTracker = {},
        trackingCallback = null; // Reference to tracking callback

    /**
     * Click Position Data, containing X, Y coordinate on where the mouse was clicked.
     * 
     * @typedef {ClickTracker~PositionData}
     * @property {int} x
     * @property {int} y
     */

    /**
     * Click Tracking Data
     *
     * @typedef {ClickTracker~ClickTrackingData}
     * @property {string} path DOM path
     * @property {ClickTracker~PositionData} position
     * @property {string} url
     */

    /**
     * Gets element full path in the DOM. Path includes node name and any CSS class names.
     * Node name will be lower-cased, but all CSS class name will be case sensitive.
     *
     * @param {HTMLElement} Element of interest
     * @returns {string}
     */
    CT.getDomPath = function(element) {
        var nodeName,
            cssClasses,
            fullPath = [],
            current = element,
            doc = global.document;

        do {
            nodeName = current.nodeName.toLowerCase();
            cssClasses = current.className ? ('.' + current.className.replace(' ', '.')) : '';

            fullPath.unshift(nodeName + cssClasses);

            current = current.parentNode;
        }
        while (current !== doc);

        return fullPath.join('\\');
    };

    /**
     * Gets click event's position as a string
     * 
     * @param {Event} Click event
     * @returns {ClickTracker~PositionData}
     */
    CT.getClickPosition = function(event) {
        return {
            x: event.pageX, 
            y: event.pageY
        };
    };

    /**
     * Gets click tracking data
     *
     * @param {Event} clickEvent
     * @returns {ClickTracker~ClickTrackingData}
     */
    CT.getTrackingData = function(clickEvent) {
        return {
            path: CT.getDomPath(clickEvent.target),
            position: CT.getClickPosition(clickEvent),
            url: global.location
        };
    };

    /**
     * Default handler for click event
     *
     * @param {Event} clickEvent
     * @returns {void}
     */
    var logClickEvent = function(clickEvent) {
        trackingCallback.call(this, CT.getTrackingData(clickEvent));
    };

    /**
     * Stops click tracking
     *
     * @returns {void}
     */
    CT.stopTracking = function() {
        if (trackingCallback) {
            global.document.removeEventListener('click', logClickEvent);
        }
    };

    /**
     * Starts click tracking
     *
     * @param {Function} callback Callback to trigger when item is clicked
     * @returns {void}
     */
    CT.startTracking = function(callback) {
        if (!callback) {
            throw new Error('You must provide a callback to log data.');
        }

        // Remove existing tracking, if any.
        this.stopTracking();

        // Stores a reference to callback for event removal.
        trackingCallback = callback;
        global.document.addEventListener('click', logClickEvent);
    };
}