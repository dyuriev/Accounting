(function() {

    function formatDate(date) {
        var dateArr = [];
        var day = date.getDate();
        var month = date.getMonth() + 1;

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        dateArr = [day.toString(), month.toString(), date.getFullYear()];

        return dateArr.join('.');
    }

    function ObjectsStorage(storageName) {
        this.storage = [];
        this.storageName = storageName;
    }

    ObjectsStorage.prototype.set = function(key, value) {
        this.storage[key] = value;
        this.sync();
    };

    ObjectsStorage.prototype.get = function(key) {
        return this.storage[key];
    };

    ObjectsStorage.prototype.sync = function() {
        var jsonData = JSON.stringify(this.storage);
        localStorage.setItem(this.storageName, jsonData);
    };


    $(function() {
        $('div.form-group .input-group.date').datepicker({
            todayBtn: "linked",
            language: "ru",
            orientation: "top auto",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });

        $('#date-add').val(formatDate(new Date()));
    });

    var storage1 = new ObjectsStorage('some');
    storage1.set('asdasd', {a:2});
    console.dir(storage1.get('asdasd'));
}());
