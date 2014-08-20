import ViewModel = require('ViewModel');
import List = require('List');

class <%= viewName %>Model extends ViewModel {
    exampleMessage = "This is the exampleMessage value in <%= viewName %>Model.ts.";
    isKittenVisible = true;
    names = new List([ 'Bob', 'Sue', 'Joe', 'Jane' ]);
    amount = '0';

    amountTimesThree() {
        return String(Number(this.amount) * 3);
    }

    addMessage() {
        this.names.push(this.exampleMessage);
    }

}

export = <%= viewName %>Model;