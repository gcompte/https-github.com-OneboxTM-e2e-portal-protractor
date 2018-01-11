function closeCookiesPolicy(){
	element(by.css('.close-policy')).isDisplayed().then(function(cookiesPresent){
		if(cookiesPresent){
	        element(by.css('.close-policy')).click();
		}
	});
};

module.exports = {
	'closeCookiesPolicy' : closeCookiesPolicy
}