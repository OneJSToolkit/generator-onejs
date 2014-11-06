import ViewModel = require('../onejs/ViewModel');
import List = require('../onejs/List');

class DemoControlModel extends ViewModel {
    /// <summary>
    /// View model class for defining the observable data contract for the DemoControl view.
    ///
    /// This class is optional and can be removed if unnecessary. Remove the
    /// js-model attribute from the DemoControl.html template's root element if you do.
    /// </summary>

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
