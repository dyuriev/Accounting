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
}());
