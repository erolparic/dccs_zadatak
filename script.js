function addEntry(entry, isChecked) {
	var table = document.getElementById("table");
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
	row.insertCell(0).innerHTML = entry;
	var s = '<input type="checkbox" name="entryDone" onclick="setCompleted(this)"';
	if( isChecked === 'true' ) {
		s += ' checked';
		row.setAttribute("class", "checked");
	}
	s += '/>';
	row.insertCell(1).innerHTML = s;
	row.insertCell(2).innerHTML = '<i name="deleteRow" class="fa fa-trash" onclick="deleteRow(this)"></i>';
	
	document.getElementById("toDoInput").value = "";
	localStorage.setItem("tableData", document.getElementById("table").innerHTML);
}

function setCompleted(row) {
	var r = row.parentNode.parentNode.rowIndex;
	if(	row.checked ) {
		row.setAttribute("checked", true);
		document.getElementById("table").rows[r].setAttribute("class", "checked");
	} else {
		row.setAttribute("checked", false);
		document.getElementById("table").rows[r].setAttribute("class", "");
	}
	localStorage.setItem("tableData", document.getElementById("table").innerHTML);
}

function deleteRow(row) {
	var r = row.parentNode.parentNode.rowIndex;
	if( confirm("Are you sure?") ) {
		document.getElementById("table").deleteRow(r);
	}
	localStorage.setItem("tableData", document.getElementById("table").innerHTML);
}

function importData(file) {
	var reader = new FileReader();
	reader.onload = function(e) {
		var lines = e.target.result.split('\r\n');
		for( var i = 0; i < lines.length; i++ ){
			var res = lines[i].split('; ');
			if( !checkForDuplicates(res[0]) )
				addEntry(res[0], res[1]);
		}
	};
	reader.readAsText(file.files[0]);
}

function checkForDuplicates(entry) {
	var table = document.getElementById("table");
	for( var i = 0; i < table.rows.length; i++ ) {
		if( table.rows[i].cells[0].innerHTML == entry )
			return true;
	}
	
	return false;
}

function exportData() {
	var table = document.getElementById("table");
	var data = "";
	
	for( var i = 1; i < table.rows.length; i++ ) {
		data += table.rows[i].cells[0].innerHTML;
		data += "; "
		data += table.rows[i].cells[1].firstChild.checked;
		if( i+1 != table.rows.length )
			data += "\r\n";
	}
	
	var a = document.getElementById("download");
	var file = new Blob([data], {tpye: 'text/plain'});
	a.href = URL.createObjectURL(file);
	a.download = "data.txt";
}

function retrieveData() {
	if( localStorage.getItem("tableData") === null )
		localStorage.setItem("tableData", document.getElementById("table").innerHTML);
	
	document.getElementById("table").innerHTML = localStorage.getItem("tableData");
}