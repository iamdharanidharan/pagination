//set global variables
var recordsNumber = 7; //default records per page
var data;

// Getting JSON data
var dataRequest = new XMLHttpRequest();
dataRequest.open('GET', 'https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json', true);
dataRequest.send();

dataRequest.onload = () => {
    data = JSON.parse(dataRequest.response);
    createButtons();
    rangeInput.setAttribute('max',data.length.toString());
    getRecords(recordsNumber, 0, false); //Set initial Table data
}

// Link bootstrap
var css = document.createElement('link');
css.setAttribute('rel', 'stylesheet');
css.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css');
document.head.append(css);


// Page container
var divContainer = document.createElement('div');
divContainer.setAttribute('class', 'container');

// Range-wrapper div to hold table and range slider
var rangeWrapper = document.createElement('div');
rangeWrapper.setAttribute('class', 'rangeWrapper');

// Button collection div
var btnCollectionDiv = document.createElement('div');
btnCollectionDiv.setAttribute('class', 'buttonCollection btn-group-lg text-center p-3');

//Page Header Text (Jumbotron)
var jumbotron = document.createElement('div');
jumbotron.setAttribute('class','jumbotron');
var h1 = document.createElement('h1');
h1.setAttribute('class','display-4');
h1.innerHTML = 'Custom Pagination';
var p = document.createElement('p');
p.setAttribute('class','lead');
p.innerHTML = 'Pagination with one-time api call. Use the Slider to set required Records Size!!!';

jumbotron.append(h1,p);

// Range slider
var rangeLabel = document.createElement('label');
rangeLabel.setAttribute('for', 'pageSize');
rangeLabel.innerHTML = 'Page Size';

var rangeInput = document.createElement('input');
rangeInput.setAttribute('class', 'form-control-range mb-3');
rangeInput.setAttribute('type', 'range');
rangeInput.setAttribute('id', 'pageSize');
rangeInput.setAttribute('min', '1');
rangeInput.setAttribute('max', '100');
rangeInput.setAttribute('value', '7');
rangeInput.onchange = () => {
    recordsNumber = parseInt(rangeInput.value);
    tableCaption.innerHTML = `Records per page ${recordsNumber}`;
    getRecords(recordsNumber, 0, true);
    createButtons();
};

// Table layout Creation
var table = document.createElement('table');
table.setAttribute('class', 'table table-hover');
var tableCaption = document.createElement('caption');
tableCaption.innerHTML = `Records per page ${recordsNumber}`;
var tableHead = document.createElement('thead');
tableHead.setAttribute('class', 'thead-dark');
var tableBody = document.createElement('tbody');

var tr = document.createElement('tr');
var th = document.createElement('th');
th.setAttribute('scope', 'col');
th.innerHTML = 'Id';
tr.append(th);
var th = document.createElement('th');
th.setAttribute('scope', 'col');
th.innerHTML = 'Name';
tr.append(th);
var th = document.createElement('th');
th.setAttribute('scope', 'col');
th.innerHTML = 'Email';
tr.append(th);
tableHead.append(tr);

table.append(tableCaption, tableHead, tableBody);

// append jumbotron, range slider, table and button collection to body
rangeWrapper.append(rangeLabel, rangeInput);
divContainer.append(jumbotron ,rangeWrapper, table, btnCollectionDiv);
document.body.append(divContainer);

//Create buttons based on Fetched data length
function createButtons() {
    //clear buttonCollection div (for range slider inputs)
    document.getElementsByClassName('buttonCollection')[0].innerHTML = '';
    
    var buttonsNeeded = Math.trunc(data.length / recordsNumber);
    if (data.length % recordsNumber != 0) buttonsNeeded++;
    for (let i = 1; i <= buttonsNeeded; i++) {
        var button = document.createElement('button');
        button.setAttribute('class', 'btn btn-outline-primary btn-lg');
        button.innerHTML = i;
        if (i == 1) {
            button.innerHTML = 'First';
            button.setAttribute('class', 'btn btn-outline-primary btn-lg active');
            button.setAttribute('id', 'firstButton');
        }
        if (i == buttonsNeeded) button.innerHTML = 'Last';
        document.body.append(button);
        button.onclick = (event) => {
            getRecords(recordsNumber, i - 1, false);
            
            //clear active class from current active button
            var currentActive = document.getElementsByClassName("active");
            currentActive[0].className = currentActive[0].className.replace(" active", "");
            
            //set active for this button (clicked button)
            event.target.className += " active";
        };
        btnCollectionDiv.append(button);
    }
}



function getRecords(records, page, rangeSlider) {
    
    var recordsFrom = records * page;
    
    //clear table contents of previous button clicks
    tableBody.innerHTML = '';

    for (let j = recordsFrom; j < recordsFrom + recordsNumber && j < data.length; j++) {
        tr = document.createElement('tr');
        th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerHTML = data[j].id;
        var td = document.createElement('td');
        td.innerHTML = data[j].name;
        tr.append(th, td);
        td = document.createElement('td');
        td.innerHTML = data[j].email;
        tr.append(td);
        tableBody.append(tr);
    }

    // for range slider inputs
    if (rangeSlider) {
        var currentActive = document.getElementsByClassName("active");
        currentActive[0].className = currentActive[0].className.replace(" active", "");
        //set first button as active
        document.getElementsByClassName('btn')[0].className += " active";
    }

}
