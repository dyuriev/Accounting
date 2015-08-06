(function() {

    var $profitAddItemForm = $('#profitAddForm');
    var $expenseAddItemForm = $('#expenseAddForm');
/*[!]*/var profitFormChecker = new DYURIEV.Checker.Checker.Checker($profitAddItemForm);
/*[!]*/var expenseFormChecker = new DYURIEV.Checker.Checker.Checker($expenseAddItemForm);
    //console.log(expenseFormChecker);
    var appStorage = new DYURIEV.ObjectStorage.ObjectStorage('budget');
    /*var profitCollection = [
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
    ];*/
    var profitCollection = [];
    var expenseCollection = [];
    var $budgetTabs = $('#budgetTabs');

    var profitTableTpl = $('#tpl-table-profits').html();
    var $profitTableDiv = $('#table-profits-div');
    var profitTableRender = _.template(profitTableTpl);

    var expenseTableTpl = $('#tpl-table-expenses').html();
    var $expenseTableDiv = $('#table-expenses-div');
    var expenseTableRender = _.template(expenseTableTpl);

    function renderProfitsTable(collection) {
        return profitTableRender({ collection: collection });
    }

    function renderExpensesTable(collection) {
        return expenseTableRender({ collection: collection });
    }

    function renderAll() {
        $profitTableDiv.html(renderProfitsTable(profitCollection));
        $expenseTableDiv.html(renderExpensesTable(expenseCollection));
    }

    function getMaxID(collection) {
        var max =  _.max(collection, function(item) {
            return item.id;
        });

        return (max && Number.isInteger(max.id)) ? max.id : 0;
    }

    $(function() {
        var _profitCollection = appStorage.get('profits');
        profitCollection = _profitCollection || [];
        var _expenseCollection = appStorage.get('expenses');
        expenseCollection = _expenseCollection || [];
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
        $('#expense-date').val(DYURIEV.Helpers.formatDate(new Date()));

        $('#btnAddProfit').on('click', function() {
            $budgetTabs.find('a[href="#addprofit"]').tab('show');
        });

        $('#btnAddExpense').on('click', function() {
            $budgetTabs.find('a[href="#addexpense"]').tab('show');
        });

        $profitAddItemForm.on('submit', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();

            profitCollection.push({
                id: getMaxID(profitCollection) + 1,
                timestamp: new Date().getTime(),
                source: $profitAddItemForm.find('[name="profit-source"]').val(),
                amount: $profitAddItemForm.find('[name="profit-amount"]').val(),
                date: $profitAddItemForm.find('[name="profit-date"]').val(),
                comment: $expenseAddItemForm.find('[name="profit-comment"]').val()
            });

            $profitAddItemForm.find('[name="profit-source"]').val('default');
            $profitAddItemForm.find('[name="profit-amount"]').val('');
            $profitAddItemForm.find('[name="profit-date"]').val(DYURIEV.Helpers.formatDate(new Date()));
            $profitAddItemForm.find('[name="profit-comment"]').val('');

            appStorage.set('profits', profitCollection);
            renderAll();
            $budgetTabs.find('a[href="#profit"]').tab('show');
        });

        $expenseAddItemForm.on('submit', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();

            expenseCollection.push({
                id: getMaxID(expenseCollection) + 1,
                timestamp: new Date().getTime(),
                source: $expenseAddItemForm.find('[name="expense-source"]').val(),
                amount: $expenseAddItemForm.find('[name="expense-amount"]').val(),
                date: $expenseAddItemForm.find('[name="expense-date"]').val(),
                comment: $expenseAddItemForm.find('[name="expense-comment"]').val()
            });

            $expenseAddItemForm.find('[name="expense-source"]').val('default');
            $expenseAddItemForm.find('[name="expense-amount"]').val('');
            $expenseAddItemForm.find('[name="expense-date"]').val(DYURIEV.Helpers.formatDate(new Date()));
            $expenseAddItemForm.find('[name="expense-comment"]').val('');

            appStorage.set('expenses', expenseCollection);
            renderAll();
            $budgetTabs.find('a[href="#expense"]').tab('show');
        });
    });
}());
