/*
** Aurthor:  L.W.Winter WPDMedia
** Title: WPD Data Table
** Description: Display data in a dynamic table with search, filter and sort options.
*/

class WPD_DATATABLE {
    constructor(structure) {

        // INSERT STYLESHEET INTO PAGE //
        var random = Math.random();
        var css = 'https://cdn.jsdelivr.net/gh/lwinter1984/codecoop_datatable@main/wpdc_datatable_stylesheet.css';
        document.querySelector('head').innerHTML += '<link rel="stylesheet" href="'+css+'" type="text/css"/>';

        this.info = {};
        this.info.class = {
            'developer': 'L.W.Winter',
            'version': '1.3',
            'version_revs': {
                '1.0': 'Framework and data processing built with css classes on all elements',
                '1.1': 'Buit sort filter and search functionality into table header',
                '1.2': 'Added clear all filters button and show all filters when filter arrow is clicked',
                '1.3': 'Store pagecount value in users cookies so the page can be refreshed and created default stylesheet'
            }
        };
        this.info.functions = {
            'genhtml': {
                'desc': 'Generates an html element quickly with one line of code. Includes an optional append to parent.',
                'call': 'classvar.genhtml("element type", {attributes}, {datasets}, "inner html", ?parent element?)'
            },
            'set_search': {
                'desc': 'Allows external search fields to pass string to filter table.',
                'call': 'classvar.set_search("search string")'
            },
            'set_page': {
                'desc': 'Set the number of rows to display per page. If second variable is true the screen will rerender the table.',
                'call': 'classvar.set_page(number, true/false)'
            },
            'add_tofooter': {
                'desc': 'Adds elements to the footer of the container.',
                'call': 'classvar.add_tofooter(element_object, start / end)'
            },
            'add_toheader': {
                'desc': 'Adds elements to the header of the container.',
                'call': 'classvar.add_toheader(element_object, start / end)'
            }
        };
        this.info.methods = {
            'pri_primedata': {
                'desc': 'This is a single call that will run multiple data processing methods. (pri_errorCheck, pri_setfilters, pri_createSearchStr, pri_icons, pri_framework, pri_runsearchopt)',
                'call':'classvar.pri_primedata()'
            },
            'pri_icons': {
                'desc': 'Stores SVG icons into the class',
                'call': 'classvar.pri_icons()'
            },
            'pri_errorCheck': {
                'desc': 'Checks for format errors in the structure passed by developer.',
                'call': 'classvar.pri_errorCheck(function(error){ error = true/false; });'
            },
            'pri_setfilters': {
                'desc': 'Looks at all values and makes a list of unique values based on if the developer sets the header cell to filter:true',
                'call': 'classvar.pri_setfilters();'
            }
        }

        // CREATE BLANK VARIABLES //
        this.html = {};
        this.icons = {};
        this.elements = {};
        this.input = {};
            this.input.structure = structure;
        this.output = {};
            this.output.original = structure.data;
            this.output.searched = [];
            this.output.pagified = [];
            this.output.filters = {};
        this.searchopt = {};
            this.searchopt.search = [];
            this.searchopt.sort = structure.dsort;
            this.searchopt.filter = {};

            // PAGINATE NUMBER / COOKIE CHECK //
            this.input.cookie_pagify = "datatable_pagify";
            var datatable_pagify = this.read_cookie(this.input.cookie_pagify);
            if (datatable_pagify) {
                this.searchopt.pagify = datatable_pagify;
            } else {
                this.searchopt.pagify = 10;
            }
            
            this.searchopt.pagetotal = 0;
            this.searchopt.page = 1;
            this.searchopt.total = 0;

        // PAGINATE DATA //
        if (structure.paginate) { this.searchopt.pagify = structure.paginate; }

        // RUN ALL DATA BUILDERS //
        this.pri_primedata();

        return this;
    }

    pri_icons() {
        // SYSTEM ICONS
        this.icons.downarrow = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1,-4.98698e-17,3.69779e-32,1,3.5,-235.328)"><path d="M12.917,242.019C12.807,241.909 12.628,241.909 12.518,242.019L6.5,248.037L0.482,242.02C0.372,241.91 0.193,241.91 0.083,242.02C-0.028,242.13 -0.028,242.309 0.083,242.419L6.3,248.637C6.356,248.692 6.428,248.719 6.5,248.719C6.573,248.719 6.645,248.692 6.7,248.636L12.917,242.419C13.028,242.309 13.028,242.129 12.917,242.019Z" style="fill-rule:nonzero;"/></g></svg>';
        this.icons.uparrow = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(-1,1.72334e-16,-1.22465e-16,-1,16.5,255.328)"><path d="M12.917,242.019C12.807,241.909 12.628,241.909 12.518,242.019L6.5,248.037L0.482,242.02C0.372,241.91 0.193,241.91 0.083,242.02C-0.028,242.13 -0.028,242.309 0.083,242.419L6.3,248.637C6.356,248.692 6.428,248.719 6.5,248.719C6.573,248.719 6.645,248.692 6.7,248.636L12.917,242.419C13.028,242.309 13.028,242.129 12.917,242.019Z" style="fill-rule:nonzero;"/></g></svg>';
        this.icons.leftarrow = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1.11102e-16,1,-1,6.12323e-17,255.328,3.5)"><path d="M12.917,242.019C12.807,241.909 12.628,241.909 12.518,242.019L6.5,248.037L0.482,242.02C0.372,241.91 0.193,241.91 0.083,242.02C-0.028,242.13 -0.028,242.309 0.083,242.419L6.3,248.637C6.356,248.692 6.428,248.719 6.5,248.719C6.573,248.719 6.645,248.692 6.7,248.636L12.917,242.419C13.028,242.309 13.028,242.129 12.917,242.019Z" style="fill-rule:nonzero;"/></g></svg>';
        this.icons.rightarrow = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1.13626e-17,-1,1,6.12323e-17,-235.328,16.5)"><path d="M12.917,242.019C12.807,241.909 12.628,241.909 12.518,242.019L6.5,248.037L0.482,242.02C0.372,241.91 0.193,241.91 0.083,242.02C-0.028,242.13 -0.028,242.309 0.083,242.419L6.3,248.637C6.356,248.692 6.428,248.719 6.5,248.719C6.573,248.719 6.645,248.692 6.7,248.636L12.917,242.419C13.028,242.309 13.028,242.129 12.917,242.019Z" style="fill-rule:nonzero;"/></g></svg>';
        this.icons.filter = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:serif="http://www.serif.com/" width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(1,0,0,1,0.0856828,0.0529143)"><path d="M4.456,4.421C4.356,4.422 4.267,4.483 4.228,4.575C4.189,4.667 4.209,4.773 4.278,4.845L8.239,8.966C8.239,8.966 8.239,15.321 8.239,15.321C8.239,15.408 8.284,15.488 8.358,15.534C8.432,15.579 8.524,15.583 8.602,15.544L11.584,14.037C11.668,13.994 11.721,13.908 11.721,13.814L11.721,9.027C11.721,9.027 15.557,4.74 15.557,4.74C15.623,4.666 15.639,4.56 15.598,4.47C15.557,4.38 15.467,4.322 15.368,4.323L4.456,4.421ZM5.04,4.916L14.806,4.828C14.806,4.828 11.284,8.765 11.284,8.765C11.243,8.81 11.221,8.87 11.221,8.931L11.221,13.66C11.221,13.66 8.739,14.915 8.739,14.915C8.739,14.915 8.739,8.866 8.739,8.866C8.739,8.801 8.714,8.739 8.669,8.693L5.04,4.916Z"/></g></svg>';
    }

    pri_primedata() {
        var tc = this;
        this.pri_errorCheck(function (error) {
            // IF NO ERRORS KEEP RUNNING
            if (error === false) {
                tc.pri_setfilters();
                tc.pri_createSearchStr();
                tc.pri_icons();
                tc.pri_framework();
                // run filters and search values
                tc.pri_runsearchopt();
            }
        });
    }

    pri_errorCheck(callback) {
        /* Check structure input and guide developer with possible fixes */
        this.info.error = {};
        var outcome = false;

        // IS HEAD MISSING FROM STRUCTURE //
        if (!this.input.structure.head) {
            this.info.error.head = [];
            this.info.head.push("head is empty, without it you wont have a header on your table");
            this.info.head.push("Example: structure.head = [['header1', 'header2', 'header3']]");
            outcome = true;
        } else {
            // CHECK IF BODY LENGTH MATCHES HEAD LENGTH //
            var bodylength = this.input.structure.body.length;
            var headlength = this.input.structure.head[0].length;

            if (headlength != bodylength) {
                this.info.error.head = [];
                this.info.head.push("Your table body columns don't match the table header columns ( H:" + headlength + " B:" + bodylength + ")");
                outcome = true;
            }
        }

        // IS A DATA SOURCE MISSING FROM STRUCTURE //
        if (!this.input.structure.data) {
            this.info.error.data = [];
            this.info.error.data.push("data is empty and is required is required for your table body");
            this.info.error.data.push("Example: structure.data = [{'R1-key1':'R1-val1', 'R1-key2':'R1-val2'}, {'R2-key1':'R2-val1', 'R2-key2':'R2-val2'}]");
            this.info.error.data.push([{ 'key1': 'val1', 'key2': 'val2' }, { 'key1': 'val3', 'key2': 'val4' }]);
            outcome = true;
        }

        callback(outcome);
    }

    pri_rendercontent() {
        // If pagify tool is set run paginate function first
        if (this.input.structure.tools.includes('pagify')) {
            this.pri_paginate(this.output.searched);
        } else {
            this.output.pagified[0] = this.output.searched;
        }
        this.pri_gentable();
    }

    // COOKIE EDITOR FAMILY //
    write_cookie(name, value, exp_days) {
        var d = new Date();
        d.setTime(d.getTime() + (exp_days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    read_cookie(name) {
        var cname = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }
    clear_cookie(name) {
        var d = new Date();
        d.setTime(d.getTime() - (60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = name + "=;" + expires + ";path=/";
    }

    whatami(element){
        var object = {};
        object.length = 0;
        object.sort = "";
        object.value = "";
        object.search = "";
        object.type = "";
        object.report = {};

        object.report['element'] = element;

        var inputs = ["input", "select", "textarea"];
        var tagnames = ["a", "div", "span"];

        object.report['typeof'] = typeof element;

        // IS ELEMENT AN ARRAY
        if (typeof element === "object" && Array.isArray(element)) {



        }

        // IS ELEMENT AN DOM OBJECT
        if (typeof element === "object" && !Array.isArray(element)) {

            object.report['tagname'] = element.tagName;
            // INPUT FIELDS
            if (inputs.includes(element.tagName.toLowerCase())) {
                if (element.tagName === "SELECT") {

                    var value = [];
                    var search = '';
                    var string = '';
                    for (var so = 0; so < element.selectedOptions.length; so++) {
                        value.push( element.selectedOptions[so].value );
                        search += "#" + element.selectedOptions[so].value + "#";
                        string += element.selectedOptions[so].value + ", ";
                    }
                    object.length = string.toString().length;
                    object.sort = string.toString();
                    object.value = value;
                    object.search = search.toString();
                    object.type = "select";

                } else {

                    object.length = element.value.toString().length;
                    object.sort = element.value;
                    object.value = element.value.toString();
                    object.search = "#" + element.value.toString() + "#";
                    object.type = "input";

                }
            }

            if (tagnames.includes(element.tagName.toLowerCase())) {

                if (element.children.length > 0) {

                    object.length = element.children[0].innerHTML.toString().length;
                    object.sort = element.children[0].innerHTML;
                    object.value = element.children[0].innerHTML.toString();
                    object.search = "#" + element.children[0].innerHTML.toString() + "#";
                    object.type = "domObject";

                } else {

                    object.length = element.innerHTML.toString().length;
                    object.sort = element.innerHTML;
                    object.value = element.innerHTML.toString();
                    object.search = "#" + element.value.toString() + "#";
                    object.type = "domObject";

                }

            }
        }

        // IS ELEMENT AN NUMBER
        if (typeof element === "number") {

            object.length = element.toString().length;
            object.sort = element;
            object.value = element.toString();
            object.search = "#" + element.toString() + "#";
            object.type = "number";
        }

        // IS ELEMENT AN STRING
        if (typeof element === "string") {

            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(element, 'text/html');

            if (htmlDoc.all[2].children[0]) {
                if (tagnames.includes(htmlDoc.all[2].children[0].tagName.toLowerCase())) {

                    // CHECK IF ELEMENT HAS ELEMENT CHILDREN
                    if (htmlDoc.all[2].children[0].children.length > 0) {

                        object.report['strObject'] = htmlDoc.all[2].children[0].children[0];
                        object.sort = object.report['strObject'].textContent;
                        object.length = object.report['strObject'].textContent.toString().length;
                        object.value = object.report['strObject'].textContent;
                        object.search = "#" + object.report['strObject'].textContent + "#";
                        object.type = "subObject";

                    } else {

                        object.report['strObject'] = htmlDoc.all[2].children[0];
                        object.sort = object.report['strObject'].textContent;
                        object.length = object.report['strObject'].textContent.toString().length;
                        object.value = object.report['strObject'].textContent;
                        object.search = "#" + object.report['strObject'].textContent + "#";
                        object.type = "string";

                    }
                } else {

                    object.length = element.length;
                    object.sort = element;
                    object.value = element;
                    object.search = "#" + element + "#";
                    object.type = "string";

                }
            } else {

                object.length = element.length;
                object.sort = element;
                object.value = element;
                object.search = "#" + element + "#";
                object.type = "string";
            }

        }

        return object;
    }
    pri_sortObject(object, keyName, orderBy = 'asc') {

        var returnObject = [];
        returnObject.error = "";
        returnObject.result = [];
        var newObject = object;

        if (Object.entries(object).length === 0) {
            returnObject.error = 'The object array cannot be empty';
            return returnObject;
        } else {

            // TEST INPUT DATA
            if (object === undefined) {
                returnObject.error = 'The object array cannot be empty';
                return returnObject;
            }

            var keytest = Object.keys(object[0]);
            if (keytest[0] === 0) {
                returnObject.error = 'Your object may be formatted incorrectly, REQ:[{name:\'\', age:\'\'}]';
                return returnObject;
            }

            if (keyName === undefined) {
                returnObject.error = 'A keyname must be provided';
                return returnObject;
            }
            if (!(keyName in object[0])) {
                returnObject.error = 'The keyname dosn\'t exist in your object';
                return returnObject;
            }
            var dataType = typeof object[0][keyName];

            // SORT OBJECT
            if (dataType == "number") {
                if (orderBy == "asc") {
                    newObject.sort((a, b) => a[keyName] - b[keyName]);
                }
                if (orderBy == "desc") {
                    newObject.sort((a, b) => b[keyName] - a[keyName]);
                }
            }
            if (dataType == "string") {
                // STRING IS A DATE
                if (!isNaN(Date.parse(object[0][keyName]))) {
                    if (orderBy == "asc") {
                        newObject.sort((a, b) => {
                            let da = new Date(a[keyName]), db = new Date(b[keyName]);
                            return da - db;
                        });
                    }
                    if (orderBy == "desc") {
                        newObject.sort((a, b) => {
                            let da = new Date(a[keyName]), db = new Date(b[keyName]);
                            return db - da;
                        });
                    }
                } else {
                    // STRING IS JUST ALPHA
                    if (orderBy == "asc") {
                        newObject.sort((a, b) => {
                            let fa = a[keyName], fb = b[keyName];
                            if (fa < fb) { return -1; } if (fa > fb) { return 1; } return 0;
                        });
                    }
                    if (orderBy == "desc") {
                        newObject.sort((a, b) => {
                            let fa = a[keyName], fb = b[keyName];
                            if (fa > fb) { return -1; } if (fa < fb) { return 1; } return 0;
                        });
                    }
                }
            }
        }

        returnObject.result = newObject;
        return returnObject;
    }
    pri_setfilters() {
        // BUILD ALL FILTER VALUES INTO OBJECT //
        for (var hc = 0; hc < this.input.structure.head[0].length; hc++) {
            var key = this.input.structure.head[0][hc].key;
            this.output.filters[key] = [];
            var filters = {};

            filters[key] = [];
            filters[key].data = [];
            filters[key].type = "string";

            for (var d = 0; d < this.input.structure.data.length; d++) {
                var objstr = this.whatami(this.input.structure.data[d][key]);

                if (objstr.type === "string" || objstr.type === "number" || objstr.type === "object") {
                    if (filters[key].data.includes(objstr.value )) {} else {
                        filters[key].data.push( objstr.value );
                    }
                }

                // IF VALUE IS ARRAY

            }

            this.output.filters[key] = filters[key].data;

            
            //this.output.filters[key] = this.output.filters[key].sort((a, b) => a.localeCompare(b));
        }
    }

    pri_createSearchStr() {
        if (this.input.structure.data && this.input.structure.head) {
            // CREATE SEARCH, SORT COLUMNS
            // Loop through data
            for (var row in this.input.structure.data) {
                // Loop through header attributes
                this.input.structure.data[row].wpddtsearch = "";
                for (var key = 0; key < this.input.structure.head[0].length; key++) {
                    var colmkey = this.input.structure.head[0][key].key;
                    var value = this.whatami(this.input.structure.data[row][colmkey]);

                    // IGNORE IF SEARCH IS FALSE
                    if (this.input.structure.head[0][key].search !== false) {
                        if (value.search) {
                            this.input.structure.data[row].wpddtsearch += value.search.toLowerCase();
                        }
                    }


                    // SEARCH VALUE
                    this.input.structure.data[row]["srt" + colmkey] = value.value;

                    // FILTER VALUE
                    this.input.structure.data[row]["ftr" + colmkey] = value.value;
                }
            }
        }
    }

    pri_framework() {
        this.html = this.genhtml("DIV", { 'class': 'wpddt_container' }, {}, "");

        // FRAMEWORK HEADER //
        this.elements.header = {};
        this.elements.header.children = {};
        this.elements.header.object = this.genhtml("DIV", { 'class': 'wpddt_header' }, {}, "", this.html);

        // FRAMEWORK BODY //
        this.elements.content = {};
        this.elements.content.children = {};
        this.elements.content.object = this.genhtml("DIV", { 'class': 'wpddt_body' }, {}, "", this.html);

        // FRAMEWORK FOOTER //
        this.elements.footer = {};
        this.elements.footer.children = {};
        this.elements.footer.object = this.genhtml("DIV", { 'class': 'wpddt_footer' }, {}, "", this.html);
    }

    pri_gentable() {
        var thisclass = this;
        this.elements.content.object.innerHTML = "";
        this.elements.header.object.innerHTML = "";
        this.elements.footer.object.innerHTML = "";

        // TOOL SETS
        if (this.input.structure.tools) {

            // PAGINATION ELEMENTS - IF pagify IS GIVEN
            if (this.input.structure.tools.includes('pagify')) {
                // HEADER PAGINATE CAGE
                this.elements.header.children.paginateCage = {};
                this.elements.header.children.paginateCage.children = {};
                this.elements.header.children.paginateCage.object = this.genhtml("SPAN", { 'class': 'wpddt_pagenumcage' }, {}, " Rows", this.elements.header.object);

                // PAGINATE DROPDOW
                this.elements.header.children.paginateCage.children.pageCount = this.genhtml("SELECT", { 'class': 'wpddt_pagenumfield' }, {}, "");
                var pgop1 = this.genhtml("OPTION", { 'value': 5 }, {}, "5", this.elements.header.children.paginateCage.children.pageCount);
                var pgop2 = this.genhtml("OPTION", { 'value': 10 }, {}, "10", this.elements.header.children.paginateCage.children.pageCount);
                var pgop3 = this.genhtml("OPTION", { 'value': 15 }, {}, "15", this.elements.header.children.paginateCage.children.pageCount);
                var pgop4 = this.genhtml("OPTION", { 'value': 20 }, {}, "20", this.elements.header.children.paginateCage.children.pageCount);
                var pgop5 = this.genhtml("OPTION", { 'value': 30 }, {}, "30", this.elements.header.children.paginateCage.children.pageCount);
                var pgop6 = this.genhtml("OPTION", { 'value': 50 }, {}, "50", this.elements.header.children.paginateCage.children.pageCount);
                var pgop7 = this.genhtml("OPTION", { 'value': 100 }, {}, "100", this.elements.header.children.paginateCage.children.pageCount);

                // SET pageCount value
                this.elements.header.children.paginateCage.children.pageCount.value = this.searchopt.pagify;

                // WHEN pageCount is changed action
                this.elements.header.children.paginateCage.children.pageCount.onchange = function () {
                    // GET PAGE COUNT
                    var pagecnt = thisclass.elements.header.children.paginateCage.children.pageCount.value;
                    // SET PAGE COUNT
                    thisclass.searchopt.pagify = pagecnt;
                    // SET COOKIE
                    thisclass.write_cookie(thisclass.input.cookie_pagify, pagecnt, 1);
                    // RUN SEARCH OPTIONS
                    thisclass.pri_runsearchopt();
                }

                // INSERT INTO paginateCage
                this.elements.header.children.paginateCage.object.insertBefore(this.elements.header.children.paginateCage.children.pageCount, this.elements.header.children.paginateCage.object.childNodes[0]);

                // FOOTER PAGINATE NAVIGATION CONTAINER
                this.elements.footer.children.paginateNav = {};
                this.elements.footer.children.paginateNav.children = {};
                this.elements.footer.children.paginateNav.object = this.genhtml("SPAN", { 'class': 'wpddt_pagenavcage' }, {}, "", this.elements.footer.object);

                // FOOTER PAGINATE CONTENT
                this.elements.footer.children.paginateNav.children.text1 = this.genhtml("SPAN", {}, {}, "Page ", this.elements.footer.children.paginateNav.object);
                this.elements.footer.children.paginateNav.children.text1.setAttribute('style', 'width:35px; text-align:center;');
                this.elements.footer.children.paginateNav.children.numberField = this.genhtml("INPUT", { 'class': 'wpddt_pagenavpg', 'type': 'number' }, {}, "", this.elements.footer.children.paginateNav.object);
                this.elements.footer.children.paginateNav.children.text2 = this.genhtml("SPAN", {}, {}, " of " + this.searchopt.pagetotal, this.elements.footer.children.paginateNav.object);

                // SET PAGE NAV VALUE
                this.elements.footer.children.paginateNav.children.numberField.value = this.searchopt.page;

                // PAGEINATE NAV ON KEY PRESS ACTION
                this.elements.footer.children.paginateNav.children.numberField.onkeypress = function (event) {
                    // GET PAGE VALUE
                    var page = thisclass.elements.footer.children.paginateNav.children.numberField.value;
                    // REMOVE NONE NUMERIC VALUES
                    thisclass.elements.footer.children.paginateNav.children.numberField.value = page.replace(/[^0-9]/g, '');
                    // IF ENTER IS PRESSED
                    if (event.keyCode === 13) {
                        // SET PAGE NUMBER
                        thisclass.searchopt.page = parseInt(page);
                        // RUN SEARCH OPTIONS
                        thisclass.pri_rendercontent();
                    }
                }
            }

            // HEADER CLEARALL_FILTERS BUTTON
            this.elements.header.children.filters = {};
            this.elements.header.children.filters.children = {};
            this.elements.header.children.filters.object = this.genhtml("BUTTON", { 'class': 'wpddt_clearallfilter' }, {}, " Clear All", this.elements.header.object);
            this.elements.header.children.filters.object.style.display = "none";

                // CLEARALL_FILTERS BUTTON ACTIONS
                this.elements.header.children.filters.object.onclick = function () {
                    var filterlength = Object.keys(thisclass.searchopt.filter).length;
                    var filtercnt = 0;
                    for (var key in thisclass.searchopt.filter) {
                        if ((filtercnt + 1) == filterlength) {
                            thisclass.clear_filter(key, true);
                        } else {
                            thisclass.clear_filter(key);
                        }
                        filtercnt++;
                    }
                };

            // Activate Search tools
            if (this.input.structure.tools.includes('search')) {

                // HEADER SEARCH CAGE
                this.elements.header.children.searchCage = {};
                this.elements.header.children.searchCage.children = {};
                this.elements.header.children.searchCage.object = this.genhtml("SPAN", { 'class': 'wpddt_searchcage' }, {}, "", this.elements.header.object);

                // SEARCH BAR
                this.elements.header.children.searchCage.children.searchInput = this.genhtml("INPUT", { 'class': 'wpddt_searchfield', 'type': 'text', 'placeholder': 'Search', 'title': 'To search specific values include # before and after value (#val#)' }, {}, "", this.elements.header.children.searchCage.object);
                var searchString = "";
                for (var src = 0; src < this.searchopt.search.length; src++) {
                    searchString += this.searchopt.search[src] + " ";
                }
                this.elements.header.children.searchCage.children.searchInput.value = searchString.substring(0, searchString.length - 1);

                // SEARCH ICON / BUTTON CONTAINER
                this.elements.header.children.searchCage.children.searchIcon = this.genhtml("SPAN", { 'class': 'wpddt_searchiconcage' }, {}, "", this.elements.header.children.searchCage.object);

                // SEARCH ACTIONS
                this.elements.header.children.searchCage.children.searchInput.onkeypress = function (event) {
                    if (event.keyCode == 13) {
                        thisclass.set_search(thisclass.elements.header.children.searchCage.children.searchInput.value, true);
                    }
                }
                this.elements.header.children.searchCage.children.searchIcon.onclick = function () {
                    thisclass.set_search(thisclass.elements.header.children.searchCage.children.searchInput.value, true);
                }
            }
        }

        // TABLE
        this.elements.content.children.table = {};
        this.elements.content.children.table.children = {};
        var datasets = {}; if (this.input.structure.datasets) { datasets = this.input.structure.datasets; }
        this.elements.content.children.table.object = this.genhtml("TABLE", { 'class': 'wpddtable' }, datasets, "", this.elements.content.object);

        // TABLE HEADER
        if (this.input.structure.head) {
            var filtercage = {};
            // TABLE HEAD
            this.elements.content.children.table.children.thead = {};
            this.elements.content.children.table.children.thead.children = {};
            this.elements.content.children.table.children.thead.object = this.genhtml("THEAD", {}, {}, "", this.elements.content.children.table.object);
            // LOOP THROUGH HEAD STRUCTURE
            for (var thr = 0; thr < this.input.structure.head.length; thr++) {
                // TABLE HEAD ROWS
                this.elements.content.children.table.children.thead.children['tr' + thr] = {};
                this.elements.content.children.table.children.thead.children['tr' + thr].object = this.genhtml("TR", {}, {}, "", this.elements.content.children.table.children.thead.object);
                this.elements.content.children.table.children.thead.children['tr' + thr].children = {};
                // LOOP THROUGH HEAD CELLS
                for (var thc = 0; thc < this.input.structure.head[thr].length; thc++) {
                    // TABLE HEAD CELLS

                    var headattributes = {};
                    if (this.input.structure.head[thr][thc].attributes) { headattributes = this.input.structure.head[thr][thc].attributes; }

                    var headdatasets = {};
                    if (this.input.structure.head[thr][thc].datasets) { headdatasets = this.input.structure.head[thr][thc].datasets; }

                    this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc] = {};
                    this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].object = this.genhtml("TH", headattributes, headdatasets, "", this.elements.content.children.table.children.thead.children['tr' + thr].object);
                    this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children = {};
                    this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].object.style.position = "relative";
                    // HEAD CELL TITLE
                    this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.title = this.genhtml("SPAN", {}, {}, this.input.structure.head[thr][thc].title, this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].object);
                    // If filter set to true
                    if (this.input.structure.head[thr][thc].filter == true) {

                        // FILTER ICON
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterIcon = this.genhtml("SPAN", { 'class': 'wpddt_tableheadopt', 'style': 'display: inline-block; width: 20px; height: 20px; vertical-align: middle; position: relative; left: 5px; cursor: pointer; float:right;', 'title': 'Show soft and filter options' }, { 'row': thr, 'cell': thc }, this.icons.downarrow, this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].object);

                        // FILTER MENU
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu = {};
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.object = this.genhtml("DIV", { 'class': 'wpddt_thfiltermenu'}, {}, "", this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].object);
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children = {};
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.object.style.display = "none";

                        // SORT A/Z
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.sortAZ = this.genhtml("DIV", {'class':'wpddt_fsblock'}, { 'sort': 'srt' + this.input.structure.head[thr][thc].key + '^asc' }, "Sort A/Z", this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.object);
                        // SORT Z/A
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.sortZA = this.genhtml("DIV", { 'class': 'wpddt_fsblock'}, { 'sort': 'srt' + this.input.structure.head[thr][thc].key + '^desc' }, "Sort Z/A", this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.object);
                        // DIVIDER LINE
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.horizontalLine = this.genhtml("HR", {}, {}, "", this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.object);
                        // FILTER BUTTON
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.filterButton = this.genhtml("DIV", { 'style': 'position:relative;' }, {}, "Filters ", this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.object);
                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.filterArrow = this.genhtml("SPAN", { 'class': 'wpddt_filterrightarrow', 'title': 'Show filters' }, {}, this.icons.rightarrow, this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.filterButton);

                        filtercage[thr + thc] = this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children;
                        // FILTER CAGE
                        filtercage[thr + thc].filterCage = this.genhtml("DIV",
                            { 'class': 'wpddt_filtercage'},
                            {}, "", this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterMenu.children.filterButton);


                        // FILTERS SEARCH
                        filtercage[thr + thc].filterSearch = this.genhtml("INPUT", { 'type': 'text', 'placeholder': 'Search', 'class': 'wpddt_filtersearch' }, { 'row': thr, 'cell': thc }, "", filtercage[thr + thc].filterCage);
                        // FILTER SEARCH ACTIONS
                        filtercage[thr + thc].filterSearch.onkeyup = function (event) {
                            var search = event.target.value;
                            var filters = document.getElementsByClassName('filteroption' + event.target.dataset.row + event.target.dataset.cell);
                            for (var f = 0; f < filters.length; f++) {
                                var valuekey = filters[f].dataset.key;
                                if (valuekey.toLowerCase().includes(search.toLowerCase())) {
                                    filters[f].style.display = "block";
                                } else {
                                    filters[f].style.display = "none";
                                }
                            }
                        };

                        // FILTERS LIST
                        filtercage[thr + thc].filterList = this.genhtml("DIV", { 'class': 'wpddt_filterlist' }, {}, "", filtercage[thr + thc].filterCage);

                        // CREATE FILTER LIST pri_tablefilters(object, parent, row, cell);
                        this.pri_tablefilters(filtercage[thr + thc], filtercage[thr + thc].filterList, thr, thc);

                        // APPLY FILTER BUTTON
                        filtercage[thr + thc].filterApply = this.genhtml("SPAN", { 'class': 'wpddt_filterbutton wpddt_filterapply' }, { row: thr, cell: thc }, "Apply", filtercage[thr + thc].filterCage);
                        filtercage[thr + thc].filterApply.onclick = function (event) {
                            var filters = document.getElementsByClassName('filteroption' + event.target.dataset.row + event.target.dataset.cell);
                            var key = thisclass.input.structure.head[event.target.dataset.row][event.target.dataset.cell].key;
                            var values = [];
                            if (key) {
                                for (var f = 0; f < filters.length; f++) {
                                    if (filters[f].children[0].checked === true) {
                                        values.push(filters[f].children[0].dataset.value);
                                    }
                                }
                            }
                            thisclass.set_filter(key, values, true);
                            thisclass.pri_changeFilterIcon();
                        };

                        // CLEAR FILTER BUTTON
                        filtercage[thr + thc].filterClear = this.genhtml("SPAN", { 'class': 'wpddt_filterbutton wpddt_filterclear' }, { row: thr, cell: thc }, "Clear", filtercage[thr + thc].filterCage);
                        filtercage[thr + thc].filterClear.onclick = function (event) {
                            var key = thisclass.input.structure.head[event.target.dataset.row][event.target.dataset.cell].key;
                            thisclass.clear_filter(key, true);
                            thisclass.pri_changeFilterIcon();
                        };

                        this.elements.content.children.table.children.thead.children['tr' + thr].children['th' + thc].children.filterIcon.onclick = function (event) {
                            var row = ""
                            var cell = "";
                            if (event.target.parentNode.dataset.row) { row = event.target.parentNode.dataset.row; } else { row = event.target.dataset.row; }
                            if (event.target.parentNode.dataset.cell) { cell = event.target.parentNode.dataset.cell; } else { cell = event.target.dataset.cell; }

                            if (row && cell) {

                                var menu = thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.object;
                                if (menu.style.display == "none") {
                                    menu.style.display = "block";
                                    // SHOW OPTIONS
                                    menu.onmouseleave = function () {
                                        menu.style.display = "none";
                                        // thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.children.filterCage.style.display = "none";
                                    }

                                    // SORT TABLE
                                    thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.children.sortAZ.onclick = function (event) {
                                        var sortstr = event.target.dataset.sort.split("^");
                                        thisclass.set_sort(sortstr[0], sortstr[1], true);
                                    }

                                    thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.children.sortZA.onclick = function (event) {
                                        var sortstr = event.target.dataset.sort.split("^");
                                        thisclass.set_sort(sortstr[0], sortstr[1], true);
                                    }

                                    // DISAPLY FILTERS
                                    thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.children.filterArrow.onclick = function (event) {
                                        if (thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.children.filterCage.style.display === "none") {
                                            thisclass.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterMenu.children.filterCage.style.display = "block";
                                        }
                                    }
                                } else {
                                    menu.style.display = "none";
                                }
                            }
                        }
                    } else { }
                }
            }
        }

        // IF DATA HAS LENGTH
        if (this.output.searched.length > 0) {
            // TABLE BODY
            this.elements.content.children.table.children.tbody = {};
            this.elements.content.children.table.children.tbody.object = this.genhtml("TBODY", {}, {}, "", this.elements.content.children.table.object);
            this.elements.content.children.table.children.tbody.children = {};

            // IF DATA AND OBJECT KEYS PROVIDED
            if (this.input.structure.data && this.input.structure.head) {
                var tabledata = this.output.pagified[(thisclass.searchopt.page - 1)];
                // LOOP THROUGH DATA ROWS
                for (var tbr = 0; tbr < tabledata.length; tbr++) {
                    // TABLE ROW
                    this.elements.content.children.table.children.tbody.children['tr' + tbr] = {};
                    this.elements.content.children.table.children.tbody.children['tr' + tbr].object = this.genhtml("TR", {}, {}, "", this.elements.content.children.table.children.tbody.object);
                    this.elements.content.children.table.children.tbody.children['tr' + tbr].children = {};
                    // Loop through column keys
                    for (var tbc = 0; tbc < this.input.structure.head[0].length; tbc++) {

                        // CELL ATTRIBUTES
                        var tdattributes = {};
                        if (this.input.structure.body[tbc].attributes) { tdattributes = this.input.structure.body[tbc].attributes; }

                        // CELL DATASETS
                        var tddatasets = {};
                        if (this.input.structure.body[tbc].datasets) { tddatasets = this.input.structure.body[tbc].datasets; }

                        // TABLE CELL
                        this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc] = {};
                        this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].object = this.genhtml("TD", tdattributes, tddatasets, "", this.elements.content.children.table.children.tbody.children['tr' + tbr].object);
                        this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].children = {};

                        // GET COLUMN KEY
                        var key = this.input.structure.head[0][tbc].key;
                        // GET COLUMN VALUE
                        var value = tabledata[tbr][key];

                        this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].phoneheader = '<span class="wpddt_phoneheader">' + this.input.structure.head[0][tbc].title + '</span>';

                        if (typeof value === 'string') {
                            this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].object.innerHTML = this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].phoneheader + '<span class="wpddt_phonetext">' + value.replace("%20", " ") + '</span>';
                        }
                        if (typeof value === 'number') {
                            this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].object.innerHTML = this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].phoneheader + '<span class="wpddt_phonetext">' +  value + '</span>';
                        }
                        if (typeof value === 'object') {
                            var valueInfo = this.whatami(value);

                            if (valueInfo.type === "array") {
                                var innerHTMLVal = this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].phoneheader + "";
                                for (var av = 0; av < valueInfo.value.length; av++) {
                                    innerHTMLVal += valueInfo.value[av] + "<br>";
                                }
                                this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].object.innerHTML = innerHTMLVal;
                            } else {

                                this.elements.content.children.table.children.tbody.children['tr' + tbr].children['td' + tbc].object.append(value);
                            }
                        }
                    }
                }
            }
        }

        this.pri_changeFilterIcon();
    }

    pri_changeFilterIcon() {
        var tc = this;
        // Change the filter icon in table header from arrow to filtered symbol based on filter key values.
        for (var row = 0; row < this.input.structure.head.length; row++) {
            for (var cell = 0; cell < this.input.structure.head[row].length; cell++) {
                var header = this.input.structure.head[row][cell];
                if (this.searchopt.filter[header.key]) {
                    if (this.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterIcon) {
                        this.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterIcon.innerHTML = this.icons.filter;

                        // SHOW CLEAR ALL FILTER BUTTON
                        this.elements.header.children.filters.object.style.display = "inline-block";
                    }
                } else {
                    if (this.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterIcon) {
                        this.elements.content.children.table.children.thead.children['tr' + row].children['th' + cell].children.filterIcon.innerHTML = this.icons.downarrow;
                    }
                }
            }
        }
    }

    pri_tablefilters(object, parent, row, cell) {
        for (var flt = 0; flt < this.output.filters[this.input.structure.head[row][cell].key].length; flt++) {
            var key = this.input.structure.head[row][cell].key;
            // FILTER VIEW CAGE
            object.filterOpt = this.genhtml("DIV", { 'class': 'wpddt_filteroption filteroption' + row + cell }, { 'key': this.output.filters[this.input.structure.head[row][cell].key][flt] }, "", parent);
            // FILTER CHECKBOX
            object.filterOptField = this.genhtml("INPUT", { 'type': 'checkbox', 'id': 'filterval' + row + cell + flt, 'style': 'vertical-align:middle;' }, { value: this.output.filters[this.input.structure.head[row][cell].key][flt] }, "", object.filterOpt);
            if (this.searchopt.filter[key]) {
                if (this.searchopt.filter[key].includes(this.output.filters[this.input.structure.head[row][cell].key][flt])) {
                    object.filterOptField.checked = true;
                }
            }
            // FILTER TITLE
            object.filterOptTitle = this.genhtml("LABEL", { 'class':'wpddt_fsblock', 'for': 'filterval' + row + cell + flt, 'style': 'display:inline-block;' }, {}, this.output.filters[this.input.structure.head[row][cell].key][flt].toString().replace("%20", " "), object.filterOpt);
        }
    }

    pri_paginate() {
        var pagify = new SOS_Func_PagifyClass(this.output.searched, this.searchopt.pagify);
        this.searchopt.pagetotal = pagify.pagify.length;
        this.output.pagified = pagify.pagify;
    }

    pri_runsearchopt() {
        var thisclass = this;
        var object = this.output.original;

        // SEARCH FILTER
        if (this.searchopt.search.length > 0) {
            object = object.filter(function (el) {
                // loop through search key values
                var cond = '';
                for (var val = 0; val < thisclass.searchopt.search.length; val++) {
                    var string = el['wpddtsearch'];
                    cond += "'" + string + "'.includes('" + thisclass.searchopt.search[val].toLowerCase() + "') && ";
                }
                return eval(cond.substring(0, cond.length - 4));
            });
        }

        // FILTERS
        // IF Filter has a key array run script
        if (object.length > 0) {
            if (Object.keys(this.searchopt.filter).length > 0) {
                // Use JS filter on object
                object = object.filter(function (el) {
                    var filtercond = '';
                    // loop through filter keys
                    for (var fkey in thisclass.searchopt.filter) {
                        // loop through filter values
                        filtercond += "("
                        for (var val = 0; val < thisclass.searchopt.filter[fkey].length; val++) {
                            var string = el['ftr' + fkey];
                            filtercond += "'" + thisclass.searchopt.filter[fkey][val] + "'==='" + string + "' || ";
                        }
                        filtercond = filtercond.substring(0, filtercond.length - 4)
                        filtercond += ") && "
                    }
                    return eval(filtercond.substring(0, filtercond.length - 4));
                });
            }
        }

        // SORT
        // IF Sort has a key array run script
        if (object.length > 0) {
            if (this.searchopt.sort) {
                // key^asc
                var srtstr = this.searchopt.sort.split("^");
                var key = srtstr[0];
                var sorted = this.pri_sortObject(object, key, srtstr[1]);
                object = sorted.result;
            }
        }

        this.searchopt.page = 1;
        this.output.searched = object;
        this.searchopt.total = this.output.searched.length;
        this.pri_rendercontent();
    }

    genhtml(type, attributes, datasets, innerhtml, parent) {
        // Generate html elements from given attributes.
        var element = document.createElement(type);
        if (attributes) { for (var at in attributes) { element.setAttribute(at, attributes[at]); } }
        if (datasets) { for (var dt in datasets) { element.dataset[dt] = datasets[dt]; } }
        if (innerhtml) { element.innerHTML = innerhtml; }
        if (parent) { try { parent.append(element); } catch (e) { } }
        return element;
    }
    set_search(string, action) {
        // Allow developers to set search values
        var search = string.split(" ");
        this.searchopt.search = search;
        if (action === true) {
            this.pri_runsearchopt();
        }
    }
    set_filter(key, values, action) {
        // Allow developers to set filter values
        this.searchopt.filter[key] = values;
        if (action === true) {
            this.pri_runsearchopt();
        }
    }
    clear_filter(key, action) {
        delete this.searchopt.filter[key];
        if (action === true) {
            this.pri_runsearchopt();
        }
    }
    set_sort(key, order, action) {
        // Allow developers to set sort values
        this.searchopt.sort = key + "^" + order;
        if (action === true) {
            this.pri_runsearchopt();
        }
    }
    set_page(number, action) {
        this.searchopt.pagify = number;
        if (action === true) {
            this.pri_runsearchopt();
        }
    }
}

class SOS_Func_PagifyClass {
    constructor(dataObject, rowsPerPage) {
        this.rowsPerPage = rowsPerPage; // (INT)
        this.original = dataObject; // STORE OBJECT IN CLASS (OBJECT)
        this.pagify = {}; // SET EMPTY (OBJECT)
        this.total = dataObject.length; // SET OBJECT LENGTH (INT)
        this.clfunc_pagify(); // CALL CLASS METHOD
    }
    clfunc_pagify() {
        var pagify = [];
        var page = 0;
        var pr = 1;

        for (var r = 0; r < this.total; r++) {
            pagify[page] = [];
            if (pr == this.rowsPerPage) {
                page++;
                pr = 1;
            } else {
                pr++;
            }
        }

        //RESET
        page = 0;
        pr = 1;
        for (r = 0; r < this.total; r++) {
            pagify[page].push(this.original[r]);
            if (pr == this.rowsPerPage) {
                page++; pr = 1;
            } else {
                pr++;
            }
        }
        this.pagify = pagify;
    }
}