DYURIEV.namespace('DYURIEV.ObjectStorage');

/**
 * ObjectStorage - a wrapper for browser`s localStorage engine.
 *
 * @version 1.0
 * @author Dmitriy Yuriev
 */
DYURIEV.ObjectStorage = (function() {
    function ObjectStorage(storageName) {
        this.storage = {};
        this.storageName = storageName;
        this.init();
    }

    ObjectStorage.prototype.init = function(key, value) {
        this.restore();
    };

    ObjectStorage.prototype.set = function(key, value) {
        this.storage[key] = value;
        this.save();
    };

    ObjectStorage.prototype.get = function(key) {
        return this.storage[key];
    };

    ObjectStorage.prototype.delete = function(key) {
        delete this.storage[key];
        this.save();
    };

    ObjectStorage.prototype.save = function() {
        var jsonData = JSON.stringify(this.storage);
        localStorage.setItem(this.storageName, jsonData);
    };

    ObjectStorage.prototype.restore = function() {
        var jsonData = localStorage.getItem(this.storageName);
        jsonData = jsonData || '{}';
        this.storage = JSON.parse(jsonData);
    };

    ObjectStorage.prototype.show = function() {
        return this.storage;
    };

    return {
        ObjectStorage: ObjectStorage
    }
}());
