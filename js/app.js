(function() {

    var $profitAddItemForm = $('#profitAddForm');
/*[!]*/var profitFormChecker = new DYURIEV.Checker.Checker.Checker($profitAddItemForm);
    var appStorage = new DYURIEV.ObjectStorage.ObjectStorage('budget');
    var profitCollection = [
        {
            id: 1,
            timestamp: 123123123,
            source: 'З/П EPAM',
            amount: 39150,
            date: '10.08.2015'
        },
        {
            id: 2,
            timestamp: 123123124,
            source: 'З/П ПИРАМИДА',
            amount: 10000,
            date: '14.08.2015'
        },
        {
            id: 3,
            timestamp: 123123125,
            source: 'З/П НАЛЕТУ',
            amount: 7500,
            date: '04.08.2015'
        }
    ];
    var $budgetTabs = $('#budgetTabs');
    var profitTableTpl = $('#tpl-table-profits').html();
    var $profitTableDiv = $('#table-profits-div');
    var profitTableRender = _.template(profitTableTpl);

    function renderProfitsTable(collection) {
        return profitTableRender({ collection: collection });
    }

    function renderAll() {
        $profitTableDiv.html(renderProfitsTable(profitCollection));
    }

    function getMaxID(collection) {
        var max =  _.max(collection, function(item) {
            return item.id;
        });

        return (max && Number.isInteger(max.id)) ? max.id : 0;
    }

    $(function() {
        renderAll();

        $('div.form-group .input-group.date').datepicker({
            todayBtn: "linked",
            language: "ru",
            orientation: "top auto",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });

        $('#profit-date').val(DYURIEV.Helpers.formatDate(new Date()));

        $('#btnAddProfit').on('click', function() {
            $budgetTabs.find('a[href="#addprofit"]').tab('show');
        });

        $profitAddItemForm.on('submit', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();

            profitCollection.push({
                id: getMaxID(profitCollection) + 1,
                timestamp: new Date().getTime(),
                source: $profitAddItemForm.find('[name="profit-source"]').val(),
                amount: $profitAddItemForm.find('[name="profit-amount"]').val(),
                date: $profitAddItemForm.find('[name="profit-date"]').val()
            });

            $profitAddItemForm.find('[name="profit-source"]').val('default');
            $profitAddItemForm.find('[name="profit-amount"]').val('');
            $profitAddItemForm.find('[name="profit-date"]').val(DYURIEV.Helpers.formatDate(new Date()));

            appStorage.set('profits', profitCollection);
            renderAll();
            $budgetTabs.find('a[href="#profit"]').tab('show');
        });
    });




    //profitStorage.restore();
    //console.log(profitStorage.get('val1'));
    //console.log(profitStorage.get('val2'));
    //profitStorage.set('val1', '1');
    //profitStorage.set('val2',2);
    //console.log(profitStorage.get('val1'));
    //console.log(profitStorage.get('val2'));

    //profitStorage.delete('val1');
    //console.log(profitStorage.get('val1'));
    //profitStorage.set('val2', {a:1});
}());
