DYURIEV.namespace('DYURIEV.Helpers');

/**
 * Helpers library
 * @type {{log, toJSON, toObject, formatMoney, formatDate}}
 */
DYURIEV.Helpers = (function () {

    return {
        log: log,
        toJSON: toJSON,
        toObject: toObject,
        formatMoney: formatMoney,
        formatDate: formatDate
    };

    /**
     * Log to console
     */
    function log() {
        if(console) {
            console.log.apply(console, arguments);
        }
    }

    /**
     * Converts object to JSON
     * @param array
     */
    function toJSON(array) {
        return JSON.stringify(array);
    }

    /**
     * Converts JSON to object
     * @param string
     */
    function toObject(string) {
        return $.parseJSON(string);
    }

    /**
     * Formats number into money format.
     * @param string
     * @returns {string}
     */
    function formatMoney(string) {
        var parts = string.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".") + ' р.';
    }

    /**
     * Formats date into DD.MM.YYYY format
     * @param date
     * @returns {string}
     */
    function formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        var dateArr = [day.toString(), month.toString(), date.getFullYear()];

        return dateArr.join('.');
    }
}());