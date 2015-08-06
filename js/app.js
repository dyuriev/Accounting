(function() {

    var $profitAddItemForm = $('#profitAddForm');
    var $expenseAddItemForm = $('#expenseAddForm');
    var $expensesTable = $('#expensesTable');


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

    function changeSortIcons($table, sortType, sortOrder) {
        var $column = $table.find('th[data-sort-type="' + sortType + '"]');
        $column.addClass('th-sorted-' + sortOrder);
    }

    function renderAll() {
        $profitTableDiv.html(renderProfitsTable(profitCollection));
        $expenseTableDiv.html(renderExpensesTable(expenseCollection));
    }

    $(function() {
        var _profitCollection = appStorage.get('profits');
        profitCollection = _profitCollection || [];
        var _expenseCollection = appStorage.get('expenses');
        expenseCollection = _expenseCollection || [];
        var $tableProfitsDiv = $('#table-profits-div');
        var $tableExpensesDiv = $('#table-expenses-div');
        var sortOrder = 'asc';
        renderAll();

        $('div.form-group .input-group.date').datepicker({
            todayBtn: "linked",
            language: "ru",
            orientation: "top auto",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });

        $profitTableDiv.on('click', '.active-table .th-sorted-column', function() {
            var sortType = $(this).attr('data-sort-type');
            sortOrder = sortOrder == 'asc' ? 'desc' : 'asc';
            profitCollection = _.sortByOrder(profitCollection, [sortType], [sortOrder]);
            renderAll();

            var $profitsTable = $profitTableDiv.find('.active-table');
            changeSortIcons($profitsTable, sortType, sortOrder);
        });

        $expenseTableDiv.on('click', '.active-table .th-sorted-column', function() {
            var sortType = $(this).attr('data-sort-type');
            sortOrder = sortOrder == 'asc' ? 'desc' : 'asc';
            expenseCollection = _.sortByOrder(expenseCollection, [sortType], [sortOrder]);
            renderAll();

            var $expenseTable = $expenseTableDiv.find('.active-table');
            changeSortIcons($expenseTable, sortType, sortOrder);
        });

        $tableProfitsDiv.on('click', 'button.btn-edit-item', function(e) {
            console.log($(this).attr('data-item-id'));
        });

        $tableProfitsDiv.on('click', 'button.btn-delete-item', function(e) {
            var itemID = $(this).attr('data-item-id');

            if (confirm('Действительно удалить?')) {
                profitCollection = _.filter(profitCollection,  function(item) {
                    return item.id != itemID;
                });

                appStorage.set('profits', profitCollection);
                renderAll();
            }
        });

        $tableExpensesDiv.on('click', 'button.btn-delete-item', function(e) {
            var itemID = $(this).attr('data-item-id');

            if (confirm('Действительно удалить?')) {
                expenseCollection = _.filter(expenseCollection,  function(item) {
                    return item.id != itemID;
                });

                appStorage.set('expenses', expenseCollection);
                renderAll();
            }
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
                id: new Date().getTime(),
                source: $profitAddItemForm.find('[name="profit-source"]').val(),
                amount: parseFloat($profitAddItemForm.find('[name="profit-amount"]').val()),
                date: DYURIEV.Helpers.parseDate($profitAddItemForm.find('[name="profit-date"]').val()),
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
                id: new Date().getTime(),
                target: $expenseAddItemForm.find('[name="expense-source"]').val(),
                amount: parseFloat($expenseAddItemForm.find('[name="expense-amount"]').val()),
                date: DYURIEV.Helpers.parseDate($expenseAddItemForm.find('[name="expense-date"]').val()),
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
