"use strict";

//var server="localhost";
var server="odm.capbpm.com";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

var selectedVal="";

var operationsText =
    "<input type=\"radio\" name=\"operations\" value=\"readSavedQuery\">Run Saved Query</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"readRecord\">Query Table</input><br>" +
    '<div id="readTableSelect"> </div>' +
    "<input type='button' value='Go' id='doOp'><br><button onclick='window.close()'>Done</button>";

var customerFormCreate="Customer Data<br>"+
    "<table>" +
    "<tr><td>First Name</td><td><textarea id='customerCreateFirstName' row='1' col='50'/></td></tr>"+
    "<tr><td>Last Name</td><td><textarea id='customerCreateLastName' row='1' col='50'/></td></tr>"+
    "<tr><td>Account Balance</td><td><textarea id='customerCreateAccountBalance' row='1' col='50'/></td></tr>"+
    "<tr><td>Age</td><td><textarea id='customerCreateAge' row='1' col='50'/></td></tr>"+
    "<tr><td>Active</td><td><textarea id='customerCreateActive' row='1' col='50'/></td></tr>"+
    "<tr><td>Start Date</td><td><textarea id='customerCreateStartDate' row='1' col='50'/></td></tr>"+
    "</table>" +
    "<br>"+
    "Customer Map Entry Data<br>"+
    "<table>" +
    "<tr><td>Key</td><td><textarea id='customerMapEntryCreateKey' row='1' col='50'/></td></tr>"+
    "<tr><td>Value</td><td><textarea id='customerMapEntryCreateValue' row='1' col='50'/></td></tr>"+
    "</table>" +
    "<button onclick='createRecord()'>Create Record</button>";

/*var customerReadInput="Read<br> <table><tr><td>Table</td><td><textarea id='tableName' row='1' col='10'/></td></tr><tr><td>Comparison Column Name</td><td><textarea id='compColName' row='1' col='10'/></td></tr><tr><td>Comparison Type</td><td><textarea id='compType' row='1' col='10'/></td></tr><tr><td>Comparison Value</td><td><textarea id='compValue' row='1' col='10'/></td></tr></table><button onclick='readRecord()'>Read Record</button>";*/

var customerUpdateInput="Update<br>"+
    "<table>" +
    "<tr><td>Table</td><td><textarea id='updateTableName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Name</td><td><textarea id='updateColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Value</td><td><textarea id='updateColValue' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='updateCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='updateCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='updateCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>" +
    "<button onclick='updateRecord()'>Update Record</button>";

var customerDeleteInput="Delete<br>" +
    "<table>"+
    "<tr><td>Table</td><td><textarea id='deleteTableName' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Column Name</td><td><textarea id='deleteCompColName' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Type</td><td><textarea id='deleteCompType' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Value</td><td><textarea id='deleteCompValue' row='1' col='10'/></td></tr>"+
    "</table>"+
    "<br>" +
    "<button onclick='deleteRecord()'>Delete Record</button>";

var generateTableInput="Generate Table<br>" +
    "<table>"+
    "<tr><td>XSD Name</td><td><textarea id='xsdName' row='1' col='50'/></td></tr>"+
    "<tr><td>Version Number</td><td><textarea id='versionNumber' row='1' col='100'>2064.374d42f7-af28-4f6d-a1c0-b34453c39b64T</textarea></td></tr>"+
    "</table>"+
    "<br>" +
    "<button onclick='generateTable()'>Generate Table</button>";

var selectedTable="";

var tables = [];

var globalComparisons;

function deleteRecord(){
    var deleteTable=$('textarea#deleteTableName').val();
    var deleteCompColName=$('textarea#deleteCompColName').val();
    var deleteCompType=$('textarea#deleteCompType').val();
    var deleteCompValue=$('textarea#deleteCompValue').val();
    var deleteString= "{\"table\":\""+deleteTable+"\", " +
	"\"comps\":[ {\"column\":\""+deleteCompColName+"\" , \"comp\":\""+deleteCompType+"\", \"value\":\""+deleteCompValue+"\" }]}";
    console.log("deleteString="+deleteString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/delete?input="+deleteString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function updateRecord(){
    var tableToUpdate=$('textarea#updateTableName').val();
    var updateColName = $('textarea#updateColName').val();
    var updateColValue = $('textarea#updateColValue').val();
    var updateCompColName = $('textarea#updateCompColName').val();
    var updateCompType = $('textarea#updateCompType').val();
    var updateCompValue = $('textarea#updateCompValue').val();

    var updateString = "{\"table\":\""+tableToUpdate+"\",\"colval\":[{\"column\":\""+updateColName+"\",\"value\":\""+updateColValue+"\"}],\"comps\":[ {\"column\":\""+updateCompColName+"\" , \"comp\":\""+updateCompType+"\",\"value\":\""+updateCompValue+"\" }]}";

    console.log("updateString="+updateString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/update?input="+updateString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });

}

function readAll(){
    var tableToRead=$('textarea#tableName').val();
    var readString2 = "{\"table\":\""+tableToRead+"\", " + "\"comps\":[]}";
    console.log("url="+"http://"+server+":8080/crudService"+selectedVal+"/read?input="+readString2);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/read?input="+readString2,
            success: function(msg) {
	        var formattedString = JSON.stringify(msg, null, 2);
		console.log("read formattedString="+formattedString);
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2)+"</pre><br>"+
				  "<textarea id=\"queryName\"></textarea><br>" +
				  "<button id=\"saveQuery\" >Save Query</button>"
				 );
		$("#output").show();
		$("#saveQuery").click(function () {
		    var parmObj = {};
		    parmObj.queryName=$("#queryName").val();
		    parmObj.query=readString2;
		    console.log("parmObj="+JSON.stringify(parmObj,null,2));
		    
		    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
	                crossDomain: true,
                        url:    "http://"+server+":8080/crudService"+selectedVal+"/saveQuery?input="+JSON.stringify(parmObj),
                        success: function(msg) {
			    console.log("success msg="+JSON.stringify(msg));
		            alert("SAVE SUCCESS");
			},
                        error: function(msg) {
		           console.log("ERROR "+JSON.stringify(msg));
		           alert("SAVE FAILED!");
                        }		    
		    });
		});

            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function readRecord(){

    var rowCount = $('#comparisonTable tr').length;

    var tableToRead=$('textarea#tableName').val();
    var readString2 = "{\"table\":\""+tableToRead+"\", " + "\"comps\":[";
    for (var idx=0; idx < rowCount; idx++){
	if (idx != 0){
	    readString2 += ", ";
	}
	var col1='#columnSelectId'+idx;
	var col2='#compSelectId'+idx;
	var col3='textarea#compValue'+idx;
        var compColName=$(col1).val();
        var compType=globalComparisons[$(col2).val()];
	var compValue=$(col3).val().toString();
	var compStr;
	if (compType == "="){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":\""+compValue+"\" }";
	}
    else if (compType == "!="){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":\""+compValue+"\" }";
	}    
	else if (compType == "in"){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }";
	}
	else if (compType == "<"){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }";
	}
	else if (compType == ">"){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }";
	}
	else if (compType == "<="){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }";
	}
	else if (compType == ">="){
	    compStr = "{\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }";
	}
	
	readString2 += compStr;
	console.log("readRecord() IN LOOP compStr="+compStr);
	
    }
    readString2 += "]}";
    
    console.log("there are "+rowCount+" rows in comparisonTable");
    console.log("readString2="+readString2);
    //var tableToRead=$('textarea#tableName').val();
    //var compColName=$('textarea#compColName').val();
    //var compType=$('textarea#compType').val();
    //var compValue=$('textarea#compValue').val();
    //var readString;

    
    var compColName=$('select#columnSelectId').val();
    var compType=globalComparisons[$('#compSelectId').val()];
    var compValue=$('textarea#compValue').val();
    var readString;

    console.log("readRecord tableToRead="+tableToRead+" compColName="+compColName+" compType="+compType+" compValue"+compValue);
    if (compType == "="){
      readString= "{\"table\":\""+tableToRead+"\", " +
  	      "\"comps\":[ {\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":\""+compValue+"\" }]}";
    }
    else if (compType == "in"){
      readString= "{\"table\":\""+tableToRead+"\", " +
  	      "\"comps\":[ {\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }]}";
    }
    else{
      readString= "{\"table\":\""+tableToRead+"\", " +
  	      "\"comps\":[]}";
    }

    console.log("url="+"http://"+server+":8080/crudService"+selectedVal+"/read?input="+readString2);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/read?input="+readString2,
            success: function(msg) {
	        var formattedString = JSON.stringify(msg, null, 2);
		console.log("read formattedString="+formattedString);
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2)+"</pre><br>"+
				  "<textarea id=\"queryName\"></textarea><br>" +
				  "<button id=\"saveQuery\" >Save Query</button>"
				 );
		$("#output").show();
		$("#saveQuery").click(function () {
		    var parmObj = {};
		    parmObj.queryName=$("#queryName").val();
		    parmObj.query=readString2;
		    console.log("parmObj="+JSON.stringify(parmObj,null,2));
		    
		    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
	                crossDomain: true,
                        url:    "http://"+server+":8080/crudService"+selectedVal+"/saveQuery?input="+JSON.stringify(parmObj),
                        success: function(msg) {
			    console.log("success msg="+JSON.stringify(msg));
		            alert("SAVE SUCCESS");
			},
                        error: function(msg) {
		           console.log("ERROR "+JSON.stringify(msg));
		           alert("SAVE FAILED!");
                        }		    
		    });
		});

            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });

}

function createSecondaryTable(serviceType,key,value){

    var createSecondaryTableString;
    if (selectedVal == "Mysql"){
	createSecondaryTableString="{\"table\":\"customermapentry\", \"colval\":[ {\"column\":\"keycol\", \"value\":\""+key+"\" }, {\"column\":\"value\" ,\"value\":\""+value+"\" }]}";
    }
    else{
	createSecondaryTableString="{\"table\":\"customermapentry\", \"colval\":[ {\"column\":\"key\", \"value\":\""+key+"\" }, {\"column\":\"value\" ,\"value\":\""+value+"\" }]}";
    }

    console.log("http://localhost:8080/crudService"+serviceType+"/create?input="+createSecondaryTableString);
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+serviceType+"/create?input="+createSecondaryTableString,
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}


function createRecord(){
    //Customer
    var customerCreateFirstName = $('textarea#customerCreateFirstName').val();
    var customerCreateLastName = $('textarea#customerCreateLastName').val();
    var customerCreateAccountBalance = $('textarea#customerCreateAccountBalance').val();
    var customerCreateAge = $('textarea#customerCreateAge').val();
    var customerCreateActive = $('textarea#customerCreateActive').val();
    var customerCreateStartDate = $('textarea#customerCreateStartDate').val();

    //Customer Map Entry Data
    var customerMapEntryCreateKey = $('textarea#customerMapEntryCreateKey').val();
    var customerMapEntryCreateValue = $('textarea#customerMapEntryCreateValue').val();

    console.log("customerCreateFirstName="+customerCreateFirstName);
    console.log("customerCreateLastName="+customerCreateLastName);
    console.log("customerCreateAccountBalance="+customerCreateAccountBalance);
    console.log("customerCreateAge="+customerCreateAge);
    console.log("customerCreateActive="+customerCreateActive);
    console.log("customerCreateStartDate="+customerCreateStartDate);

    //Customer Map Entry Data
    console.log("customerMapEntryCreateKey="+customerMapEntryCreateKey);     //need to use this value as aliascustomermapentry in Customer rec
    console.log("customerMapEntryCreateValue="+customerMapEntryCreateValue);


    var createCustomerString="{\"table\":\"customer\", \"colval\":[ {\"column\":\"startdate\", \"value\":\""+customerCreateStartDate+"\" }, {\"column\":\"accountbalance\" ,\"value\":\""+customerCreateAccountBalance+"\" }, {\"column\":\"age\" ,\"value\":\""+customerCreateAge+"\" }, {\"column\":\"firstname\" , \"value\":\""+customerCreateFirstName+"\" }, {\"column\":\"lastname\", \"value\":\""+customerCreateLastName+"\" }, {\"column\":\"isactive\" ,\"value\":\""+customerCreateActive+"\" }, {\"column\":\"aliascustomermapentry\" ,\"value\":\""+customerMapEntryCreateKey+"\" }]}";

    $("#input").hide();
    $("#output").hide();
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/create?input="+createCustomerString,
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
		createSecondaryTable(selectedVal,customerMapEntryCreateKey,customerMapEntryCreateValue);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}


function handleDrop(){

    var tableName = $('textarea#tableToDrop').val()
    console.log("selectedVal="+selectedVal+" dropping table " + tableName);
    $("#input").hide();
    $("#output").hide();
   /*$.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://localhost:8080/crudService"+selectedVal+"/deleteTable?input="+tableName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
	    });*/
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/deleteTable?input="+tableName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function generateTable(){

        var xsdName = $('textarea#xsdName').val();
    console.log("generateTable() xsdName="+xsdName.capitalize());
        var versionNumber = $('textarea#versionNumber').val();
        var unencodedInput = "https://bpm.capbpm.com:9443/webapi/ViewSchema.jsp?type="+xsdName.capitalize()+"&version="+versionNumber

	var encodedUrl = encodeURIComponent(unencodedInput);

    console.log("encodedUrl="+encodedUrl);

    $("#input").hide();
    $("#output").hide();

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            //beforeSend: function (xhr) {
            //   xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            //},
            //url:    "http://odm.capbpm.com:8080/crudService"+selectedVal+"/generateTable3?input=https%3A%2F%2Fbpm.capbpm.com%3A9443%2Fwebapi%2FViewSchema.jsp%3Ftype%3DCustomer%26version%3D2064.374d42f7-af28-4f6d-a1c0-b34453c39b64T",
            url:    "http://"+server+":8080/crudService"+selectedVal+"/generateTable3?input="+encodedUrl,
            //data: "{\"loginToken\":\""+"\",  \"password\":\""+"\", \"gpsLat\":\""+currentLat+"\", \"gpsLong\":\""+currentLong+"\", \"searchRadius\":\""+searchRadius+"\"}",
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
		//console.log("success msg="+msg);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            	//alert("cassandra generateTable3 returned=["+msg+"]");
            }
          });
}

function listComparisons(database, op){
    console.log("listComparisons database="+database+" op="+op);
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+database+"/getComparisons",
            success: function(msg) {

                for(var idx in msg) {
		    console.log("listComparisons idx="+idx+" msg[idx]="+msg[idx]);
                }

		globalComparisons=msg;

		var comparisons=msg;
		handleDatabase(database, op, comparisons);
            },
            error: function(msg) {
                alert("Could not list valid comparisons for "+database);
            }
          });
}

function getComparisons(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/getComparisons",
            success: function(msg) {

		var s = '<select id="selectId" name="selectName">';
                for(var idx in msg) {
		    console.log("idx="+idx+" msg[idx]="+msg[idx]);
		    s +=   '<option value="'+idx + '">' + msg[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg) + "<br>"+s);

		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function getTables(){

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {
                tables = new Array();
		var s = '<select id="selectTable" name="selectTableName">';
		var tableArr = msg.tableNames;
		var first = true;
		var tablesIdx = 0;
                for(var idx in tableArr) {
                    tables.push(tableArr[idx]);
                }

            },
            error: function(msg) {
		tables = new Array();
                alert("Unable to list available tables");
            }
          });
}

function showTables(divId, nextFunction, comps){
    console.log("showTables comps="+comps);
                var s = '<br><br><select id="selectTable" name="selectTableName">';
                s +=   '<option value="">Available Tables</option><br>';
		var first = true;
                for(var idx in tables) {
		    console.log("idx="+idx+" tables[idx]="+tables[idx]);
		    if (first){
			selectedTable = tables[idx];
			first = false;
		    }
		    s +=   '<option value="'+tables[idx] + '">' + tables[idx] + '</option><br>';
                }
		s += '</select></br></br>';

		$(divId).html(s);

		$(divId).show();

                $('#selectTable').on('change', function() {
	            $(divId).hide();
		    selectedTable = this.value;
		    //list columns
		    listColumns2(divId,selectedTable, nextFunction, comps);
		    //perform action
                });

}

function listTables(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {

		var s = '<select id="selectTable" name="selectTableName">';
		var tableArr = msg.tableNames;
		var first = true;
                for(var idx in tableArr) {
		    console.log("idx="+idx+" tableArr[idx]="+tableArr[idx]);
		    if (first){
			selectedTable = tableArr[idx];
			first = false;
		    }
		    s +=   '<option value="'+tableArr[idx] + '">' + tableArr[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2) + "<pre><br>"+s);

		$("#output").show();

		$('#selectTable').on('change', function() {
		    selectedTable = this.value;
                });
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function listKeys(jsonObject){

    var keys = [];
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
           keys.push(key);
        }
    }
    return keys;
}

function listColumns2(divId, table, nextFunction, comps){

    console.log("listColumns table="+table+" comps="+comps);

    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+table,
        success: function(msg) {

	        //var divIdCurrentHtml = $(divId).html();

	    var keys = listKeys(msg);
	    for (var idx=0;idx<keys.length; idx++){
		console.log("listColumsn2 key="+keys[idx]+" val="+msg[keys[idx]].columnName+" "+msg[keys[idx]].columnType+" "+msg[keys[idx]].isKey);
	    }

	        //var formattedString = JSON.stringify(msg, null, 4);
		//$(divId).html(divIdCurrentHtml+"<pre>"+formattedString+"</pre>");
	        //$(divId).show();

	    nextFunction(table, msg, comps);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}

function listColumns2Orig(divId, table){

    console.log("listColumns table="+table);

    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+table,
            success: function(msg) {
	        var divIdCurrentHtml = $(divId).html();

	        var formattedString = JSON.stringify(msg, null, 4);
		$(divId).html(divIdCurrentHtml+"<pre>"+formattedString+"</pre>");
		$(divId).show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}

function listColumns(table){

    console.log("listColumns table="+table);
    $("#input").hide();
    $("#output").hide();

    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+table,
            success: function(msg) {
	        var formattedString = JSON.stringify(msg, null, 4);
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+formattedString+"</pre>");
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}

var globalTableColumnType;
var globalComps;
var globalSelectCtr;

    function addRow(){
      var s = '<select id="columnSelectId'+globalSelectCtr+'" name="columnSelectName">';
      for(var idx in globalTableColumnType) {
	    s +=   '<option value="'+ globalTableColumnType[idx].columnName + '">' + globalTableColumnType[idx].columnName + '</option>';
      }
      s += '</select>';

      var compSelect = '<select id="compSelectId'+globalSelectCtr+'" name="compSelectName">';	
      for(var idx in globalComps) {
	compSelect += '<option value="'+idx + '">' + globalComps[idx] + '</option>';
      }
      s += '</select>';

	//var s="s";
	//var compSelect="compSelect";
	var newRow = "<tr><td>Comparison Column Name</td><td>"+s+"</td><td>Comparison Type</td><td>"+compSelect+"</td><td>Comparison Value</td><td><textarea id='compValue"+globalSelectCtr+"' row='1' col='10'/></td></tr>";
	console.log("newRow="+newRow);
      $('#comparisonTable tr:last').after(newRow);
	globalSelectCtr++;	
    }

function deleteRow(){
    var rowCount = $('#comparisonTable tr').length;
    if (rowCount > 1){
      $('#comparisonTable tr:last').remove();
	  globalSelectCtr--;
    }
}

var displayReadInputForQueryRecord = function(tableName, tableColumnType, comps){

    globalTableColumnType = tableColumnType;
    globalComps = comps;
    globalSelectCtr = 0;
    
    console.log("displayReadInputForQueryRecord START comps="+JSON.stringify(comps,null,2)+" tableColumnType="+JSON.stringify(tableColumnType, null, 2));

    var s = '<select id="columnSelectId'+globalSelectCtr+'" name="columnSelectName">';
    for(var idx in tableColumnType) {
	//if (tableColumnType[idx].isKey == true){
            console.log("displayReadInputForQueryRecord idx="+idx+" tableColumnType[idx].columnName="+tableColumnType[idx].columnName);
	    s +=   '<option value="'+ tableColumnType[idx].columnName + '">' + tableColumnType[idx].columnName + '</option>';
	//}
	//else{
        //    console.log(tableColumnType[idx].columnName+" NOT KEY");
	//}
    }
    s += '</select>';

    var compSelect = '<select id="compSelectId'+globalSelectCtr+'" name="compSelectName">';
    for(var idx in comps) {
	console.log("displayReadInputForQueryRecord idx="+idx+" comps[idx]="+comps[idx]);

	compSelect += '<option value="'+idx + '">' + comps[idx] + '</option>';
    }
    compSelect += '</select>';
    console.log("displayReadInputForQueryRecord s="+s);

    var customerReadInput="Read<br>" +
	"<table>"+
	"<tr><td>Table</td><td><textarea readonly id='tableName'>"+tableName+"</textarea></td></tr>"+
	"<div>" +
	"<table id='comparisonTable'>" + 
           "<tr><td>Comparison Column Name</td><td>"+s+"</td><td>Comparison Type</td><td>"+compSelect+"</td><td>Comparison Value</td><td><textarea id='compValue"+globalSelectCtr+"' row='1' col='10'/></td></tr>"+
	"</table>"+ 
	"</div>"+
	"</table>"+
	"<button onclick='addRow()'>Add</button>" +
	"<button onclick='deleteRow()'>Delete</button>" +        
	"<button onclick='readRecord()'>Read Record</button>"+
	"<button onclick='readAll()'>Show All</button>";

    globalSelectCtr++;
    
    console.log("displayReadInputForQueryRecord customerReadInput="+customerReadInput);
    $("#input").html(customerReadInput);
    $("#input").show();
}

function getSavedQueryName(db){
    //show html for getting query name
    //show button to execute named query
    var getSavedQueryHtml = "<textarea id=\"savedQueryName\"></textarea><br><button id=\"runSavedQuery\">Run</button><br>";


    $("#output").html(getSavedQueryHtml);
    $("#output").show();

    $("#runSavedQuery").click(function () {
	var savedQueryName = $("#savedQueryName").val();
	console.log("getSavedQueryName db="+db+" savedQueryName="+savedQueryName);
	    $("#output").hide()
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/runSavedQuery?input="+savedQueryName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg,null,2)+"</pre>");
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
    });
}


function handleDatabase(db, op, comps){

    console.log("handleDatabase db="+db+" op="+op);

    if (op == "readSavedQuery"){
	getSavedQueryName(db);
    }
    else if (op == "readRecord"){
      getTables();
      showTables("#output",displayReadInputForQueryRecord, comps);
    }

}



function myFunction(){

    console.log("HERE I AM");

$(document).on({
    ajaxStart: function() {console.log("Pend ajaxStart START"); $("body").addClass("loading");  $('#modalDiv').addClass("modal"); $('#modalDiv').show(); console.log("Pend ajaxStart END");  },
    ajaxStop: function() {console.log("Pend ajaxStop START"); $("body").removeClass("loading"); $('#modalDiv').removeClass("modal");  $('#modalDiv').hide(); console.log("Pend ajaxStop END"); }
});
    
    selectedVal = "Cassandra";
          var selectedDb = selectedVal;

	  tables = getTables(selectedDb);
	  $("#operations").html("<br>you clicked "+selectedDb+"<br>"+operationsText);

          $("#doOp").click(function () {

	     $("#output").hide();
	     var selectedOp = $('input:radio[name=operations]:checked').val();
	     console.log ("you are going to do "+selectedOp+" for "+selectedVal);

	      if (selectedVal == "Cassandra"){
		  listComparisons(selectedDb, selectedOp);
		  //handleDatabase(selectedDb, selectedOp, comparisons);
	      }
	      else if (selectedVal == "Mysql"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Elasticsearch"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Mongo"){
		  handleDatabase(selectedDb, selectedOp);
	      }
          });

      /*$("#isSelect").click(function () {

	  selectedVal = $('input:radio[name=sex]:checked').val();
          var selectedDb = selectedVal;

	  tables = getTables(selectedDb);
	  $("#operations").html("<br>you clicked "+selectedDb+"<br>"+operationsText);

          $("#doOp").click(function () {

	     $("#output").hide();
	     var selectedOp = $('input:radio[name=operations]:checked').val();
	     console.log ("you are going to do "+selectedOp+" for "+selectedVal);

	      if (selectedVal == "Cassandra"){
		  listComparisons(selectedDb, selectedOp);
		  //handleDatabase(selectedDb, selectedOp, comparisons);
	      }
	      else if (selectedVal == "Mysql"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Elasticsearch"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Mongo"){
		  handleDatabase(selectedDb, selectedOp);
	      }
          });

      });*/



}
