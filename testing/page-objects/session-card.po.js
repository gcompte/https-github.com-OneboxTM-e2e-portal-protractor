function getSessionInfo(sessionId) {
    return {
    	"sessionTitle" : element(by.css('.info-text .item-title')).getText(),
    	"sessionDate" : element(by.css('.date')).getText(),
    	"sessionTime" : element(by.css('.time')).getText(),
    	"sessionLocation" : element(by.css('.place')).getText()
    }
};

function getAllTicketsSelected(sessionId) {
	return element(by.css('#session-' + sessionId)).all(by.repeater('ticket in sessionData.tickets'));
};

module.exports = {
    'getSessionInfo' : getSessionInfo,
    'getAllTicketsSelected' : getAllTicketsSelected
 }