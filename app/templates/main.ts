import AppRoot = require('AppRoot');

if (document.body) {
    initialize();
}
else {
    document.onload = initialize;
}

function initialize() {
    var app = new AppRoot();
    var body = document.body;

    // Wire up dispose on unload.
    window.addEventListener('unload', function() {
        app.dispose();
    });

    // Wire up resize on window resize.
    window.addEventListener('resize', function() {
        app.resize();
    });

    body.appendChild(app.render());
    app.activate();
}
