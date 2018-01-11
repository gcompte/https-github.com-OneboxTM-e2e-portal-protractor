var mapBackButton = element(by.css('.back-button-container')),
    mapStyleTransform = element.all(by.tagName('svg')).get(1);

//Esta función nos servirá para mover el mapa y ampliarlo, recibe el parámetro "action" que puede tener los valores ['zoom-in', 'zoom-zero', 'zoom-out', 'up', 'right', 'down', 'left', 'middle']
function mapTransform(action){
    element(by.id('map-navigator-' + action)).click();
    return mapStyleTransform.getAttribute('style');
}

function mapGoBack() {
    return mapBackButton.click();
};

module.exports = {
    'mapTransform' : mapTransform,
    'mapGoBack' : mapGoBack
}