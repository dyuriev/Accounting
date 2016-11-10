DYURIEV.namespace('DYURIEV.Checker');

/**
 * Checker - simple form validator.
 *
 * @version 1.0
 * @author Dmitriy Yuriev
 */
DYURIEV.Checker.Validators = (function(){
    return {
        validators: {
            required: function (val) {
                val = val || "";
                return val.trim().length > 0;
            },
            email: function (val) {
                var re = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i);
                return re.test(val);
            },
            maxlength: function (val, arg) {
                return val.trim().length <= arg;
            },
            minlength: function (val, arg) {
                return val.trim().length > arg;
            },
            numeric: function (val) {
                return $.isNumeric(val);
            },
            'rusdate': function(val) {
                var re = new RegExp(/^\d{2}\.\d{2}\.\d{4}$/i);
                return re.test(val);
            }
        },
        messages: {
            required: function () {
                return 'Поле обязательно для выбора или заполнения';
            },
            email: function () {
                return 'You must input correct email address.';
            },
            maxlength: function (arg) {
                return 'Max length of this field is ' + arg;
            },
            minlength: function (arg) {
                return 'Min length of this field is ' + arg;
            },
            numeric: function () {
                return 'Вы должны ввести числовое значение';
            },
            rusdate: function () {
                return 'Вы должны ввести дату ДД.ММ.ГГГГ';
            }

        }
    }
}());

DYURIEV.Checker.Checker = (function() {
    var ulErrorsBlockTpl = $('#ul-errors-block').html();
    var ulErrorBlockRender = _.template(ulErrorsBlockTpl);

    var validators = DYURIEV.Checker.Validators.validators;
    var messages = DYURIEV.Checker.Validators.messages;

    function Checker($form) {
        if (!(this instanceof Checker)) {
            return new Checker($form);
        }

        this.checkedItems = [];
        this.$validatingForm = null;
        this.$validatingFields = null;
        this.invalidFields = [];
        this.init($form);
    }

    Checker.prototype.init = function($form) {
        if ($form.attr('data-checker-validate')) {
            this.$validatingForm = $form;
            this.$validatingFields = this.$validatingForm.find('[data-checker-rules]');

            var that = this;
            if (_.isObject(this.$validatingFields) && this.$validatingFields.length > 0) {
                _.forEach(this.$validatingFields, function (item, i) {
                    that.checkedItems.push({
                        field: item,
                        rules: that.getFieldRules(item),
                        errors: []
                    });
                });

                this.handleEvents(this.$validatingForm, this.$validatingFields);
            }
        }
    };

    Checker.prototype.handleEvents = function($form, $fields) {
        var that = this;

        $fields.on('blur', function(e) {
            that.validateField(this);
        });

        $form.on('submit', function(e) {
            var hasValidationErrors = that.validateAllFields();

            if (hasValidationErrors) {
                var $firstField = $(that.invalidFields[0]);
                $firstField.focus();
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });
    };

    Checker.prototype.getFieldRules = function(field) {
        var $field = $(field);
        var rules = [];
        var _rules = $field.attr('data-checker-rules').split(',');

        _.forEach(_rules, function(rule, i) {

            var attributes = [];
            var arg, ruleName;

            if (rule.indexOf('=') > 0) {
                attributes = rule.split('=');
                ruleName = attributes[0];
                arg = attributes[1];
            } else {
                ruleName = rule;
                arg = undefined;
            }

            rules.push([ruleName, arg]);
        });

        return rules;
    };

    Checker.prototype.renderErrorBlock = function(fieldErrors) {
        return ulErrorBlockRender({ fieldErrors: fieldErrors });
    };

    Checker.prototype.hideErrorTooltip = function(field) {
        var $field = $(field);

        $field.removeClass('error-border');
        $field.siblings('ul.checker-error-list').remove();
    };

    Checker.prototype.showErrorTooltip = function(field) {
        var errorMessages = [];
        var that = this;

        _.forEach(this.checkedItems, function(item, i) {

            if (item.field == field) {
                var $field = $(field);

                if (_.isArray(item.errors) && item.errors.length > 0) {

                    _.forEach(item.errors, function(error) {
                        errorMessages.push(error.message);
                    });

                    that.hideErrorTooltip(field);
                    $field.addClass('error-border');
                    $field.after(that.renderErrorBlock(errorMessages));
                }
            }
        });
    };

    Checker.prototype.validateField = function(field) {
        var fieldValue = $(field).val();
        var hasError = false;

        _.forEach(this.checkedItems, function(item, i) {

            if (item.field == field) {
                item.errors = [];

                _.forEach(item.rules, function(ruleItem, i) {
                    var rule = ruleItem[0];
                    var arg = ruleItem[1];
                    var currRule = validators[rule];

                    if (!currRule) {
                        throw new Error('Wrong rule name.');
                    }

                    if (!currRule(fieldValue, arg)) {
                        item.errors.push({
                            message: messages[rule](arg),
                            rule: rule,
                            value: fieldValue,
                            arg: arg
                        });

                        hasError = true;
                    }
                });
            }
        });

        if(hasError) {
            this.showErrorTooltip(field);
        }
        else {
            this.hideErrorTooltip(field);
        }

        return hasError;
    };

    Checker.prototype.validateAllFields = function() {
        var that = this;
        var hasErrors = false;

        this.invalidFields = [];

        _.forEach(this.checkedItems, function (item, i) {
            if (that.validateField(item.field)) {
                that.invalidFields.push(item.field);
                hasErrors = true;
            }
        });

        return hasErrors;
    };

    Checker.prototype.getItems = function() {
        return this.checkedItems;
    };

    return {
        Checker: Checker
    };
}());

