(function() {

    var $profitAddItemForm = $('#profitAddForm');
    var $expenseAddItemForm = $('#expenseAddForm');
    var $expensesTable = $('#expensesTable');

    var appStorage = new DYURIEV.ObjectStorage.ObjectStorage('budget');
    var profitCollection = [];
    var expenseCollection = [];
    var profitSourceCollection = [
        {
            name: 'EPAM',
            value: '39150'
        },
        {
            name: 'Пирамида',
            value: '10000'
        },
        {
            name: 'НАЛЕТУ',
            value: '7500'
        }
    ];
    var expenseTargetCollection = [
        {
            name: 'Сигареты',
            value: '150'
        },
        {
            name: 'Бензин',
            value: '800'
        },
        {
            name: 'Еда на работе',
            value: '250'
        }
    ];
    var $budgetTabs = $('#budgetTabs');

    var profitTableTpl = $('#tpl-table-profits').html();
    var $profitTableDiv = $('#table-profits-div');
    var profitTableRender = _.template(profitTableTpl);

    var expenseTableTpl = $('#tpl-table-expenses').html();
    var $expenseTableDiv = $('#table-expenses-div');
    var expenseTableRender = _.template(expenseTableTpl);


    var profitSourcesTpl = $('#tpl-profit-sources').html();
    var $profitSourcesSelect = $('#profit-source');
    var profitSourcesRender = _.template(profitSourcesTpl);

    var expenseTargetsTpl = $('#tpl-expense-targets').html();
    var $expenseTargetsSelect = $('#expense-target');
    var expenseTargetsRender = _.template(expenseTargetsTpl);

    DYURIEV.Checker.Checker.Checker($profitAddItemForm);
    DYURIEV.Checker.Checker.Checker($expenseAddItemForm);

    function renderProfitsTable(collection) {
        return profitTableRender({ collection: collection });
    }

    function renderExpensesTable(collection) {
        return expenseTableRender({ collection: collection });
    }

    function renderProfitSources(collection) {
        return profitSourcesRender({ profitSources: collection });
    }

    function renderExpenseTargets(collection) {
        return expenseTargetsRender({ expenseTargets: collection });
    }

    function changeSortIcons($table, sortType, sortOrder) {
        var $column = $table.find('th[data-sort-type="' + sortType + '"]');
        $column.addClass('th-sorted-' + sortOrder);
    }

    function renderTemplate(templateName, templateData) {
        if (!renderTemplate.templateCache ) {
            renderTemplate.templateCache = {};
        }

        if (!renderTemplate.templateCache[templateName] ) {
            var templateDir = '/templates',
                templateUrl = templateDir + '/' + templateName + '.html',
                templateString = '';

            $.ajax({
                url: templateUrl,
                method: 'GET',
                dataType: 'html',
                async: false,
                success: function(data) {
                    templateString = data;
                }
            });

            renderTemplate.templateCache[templateName] = _.template(templateString);
        }

        return renderTemplate.templateCache[templateName](templateData);
    }

    function renderAll() {
        $profitTableDiv.html(renderProfitsTable(profitCollection));
        $expenseTableDiv.html(renderTemplate('expense', {collection: expenseCollection}));
        $profitSourcesSelect.html(renderProfitSources(profitSourceCollection));
        $expenseTargetsSelect.html(renderExpenseTargets(expenseTargetCollection));
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

        $('.btn-return-expense').on('click', function() {
            $budgetTabs.find('a[href="#expense"]').tab('show');
            return false;
        });

        $('.btn-return-profit').on('click', function() {
            $budgetTabs.find('a[href="#profit"]').tab('show');
            return false;
        });

        $('#btnAddExpense').on('click', function() {
            $budgetTabs.find('a[href="#addexpense"]').tab('show');
        });

        $profitAddItemForm.on('submit', function(e) {
            profitCollection.push({
                id: new Date().getTime(),
                source: $profitAddItemForm.find('[name="profit-source"]').val(),
                amount: parseFloat($profitAddItemForm.find('[name="profit-amount"]').val()),
                date: DYURIEV.Helpers.parseDate($profitAddItemForm.find('[name="profit-date"]').val()),
                timestamp: DYURIEV.Helpers.parseDate($profitAddItemForm.find('[name="profit-date"]').val()).getTime(),
                comment: $expenseAddItemForm.find('[name="profit-comment"]').val()
            });

            $profitAddItemForm.find('[name="profit-source"]').val('default');
            $profitAddItemForm.find('[name="profit-amount"]').val('');
            $profitAddItemForm.find('[name="profit-date"]').val(DYURIEV.Helpers.formatDate(new Date()));
            $profitAddItemForm.find('[name="profit-comment"]').val('');

            appStorage.set('profits', profitCollection);
            $budgetTabs.find('a[href="#profit"]').tab('show');
            renderAll();

            return false;
        });

        $expenseAddItemForm.on('submit', function(e) {
            expenseCollection.push({
                id: new Date().getTime(),
                target: $expenseAddItemForm.find('[name="expense-target"]').val(),
                amount: parseFloat($expenseAddItemForm.find('[name="expense-amount"]').val()),
                date: DYURIEV.Helpers.parseDate($expenseAddItemForm.find('[name="expense-date"]').val()),
                timestamp: DYURIEV.Helpers.parseDate($expenseAddItemForm.find('[name="expense-date"]').val()).getTime(),
                comment: $expenseAddItemForm.find('[name="expense-comment"]').val()
            });

            $expenseAddItemForm.find('[name="expense-source"]').val('default');
            $expenseAddItemForm.find('[name="expense-amount"]').val('');
            $expenseAddItemForm.find('[name="expense-date"]').val(DYURIEV.Helpers.formatDate(new Date()));
            $expenseAddItemForm.find('[name="expense-comment"]').val('');

            appStorage.set('expenses', expenseCollection);
            $budgetTabs.find('a[href="#expense"]').tab('show');
            renderAll();

            return false;
        });
    });
}());
