var datePickerInput = element(by.id('events-search-input')),
    dpTableHeader = element(by.css('.date-picker-wrapper .dropdown-menu table thead tr:nth-child(1)')),
    dpTableBody = element(by.css('.date-picker-wrapper .dropdown-menu table tbody')),
    dpNextMonth = dpTableHeader.element(by.css('th:nth-child(3)')),
    dpPreviousMonth = dpTableHeader.element(by.css('th:nth-child(1)')),
    dpActualMonth = dpTableHeader.element(by.css('th:nth-child(2)'));

function getDatePicker(){
    return datePickerInput;
};

function expandDatePicker(){
    datePickerInput.click();
};

function selectNextMonth(){
    dpNextMonth.click();
};

function selectDay(week, day){
    dpTableBody.element(by.css('tr:nth-child(' + week + ') td:nth-child(' + day + ')')).click();
};

function getActualMonthYear(){
    return element(by.css('.date-picker-wrapper .calendar-month')).getText();
};

function getDaysWithSessions(){
    return element.all(by.css('td.valid'));
};

module.exports = {
    'expandDatePicker' : expandDatePicker,
    'selectNextMonth' : selectNextMonth,
    'selectDay' : selectDay,
    'getDatePicker' : getDatePicker,
    'getActualMonthYear' : getActualMonthYear,
    'getDaysWithSessions' : getDaysWithSessions
}