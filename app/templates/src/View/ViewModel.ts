import ViewModel = require('ViewModel');

class <%= viewName %>Model extends ViewModel {
    exampleMessage = "This is the exampleMessage value in <%= viewName %>Model.ts.";
    isKittenVisible = true;
    names = [ 'Bob', 'Sue', 'Joe', 'Jane' ];

    onChange(ev) {
        this.exampleMessage = ev.srcElement.getAttribute('value');
        this.change();
    }
}

export = <%= viewName %>Model;