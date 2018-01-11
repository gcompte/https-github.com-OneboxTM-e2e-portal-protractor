function expandOffCanvasMenu(){
	return element(by.css('.tab-bar .menu-icon')).click();
};

function getOffCanvasMenu(){
	return element(by.css('aside.left-off-canvas-menu'));
};

function getOffCanvasMenuOptions(){
	return element.all(by.css('.header-help > li')).getText();
};

module.exports = {
	'expandOffCanvasMenu' : expandOffCanvasMenu,
	'getOffCanvasMenu' : getOffCanvasMenu,
	'getOffCanvasMenuOptions' : getOffCanvasMenuOptions
}