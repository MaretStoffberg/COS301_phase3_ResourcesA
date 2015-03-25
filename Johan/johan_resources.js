/**
*	Johan van Rooyen
*	u11205131
*	This file contains my version of the constraints functions as well as some basic functions that show other methods for
*	getting the mime-type and properties of a file.
*/

resources.prototype.checkConstraints = function(_mimeType, _fileSize)
{
	/**
	*	find in collection: resources the record mimeType (input value) in the fieldL mimeType.
	*	AND test if the size is smaller or equal to the fileSize.
	*
	*	This assumes that each mimeType has its own fileSize and there is not a global max specified.
	*	If, however, there is, a test should be implemented to see if it fits both criteria.
	*
	*	Field names are in quotes to avoid confusion with js names and prevent errors (apparently works either way).
	*/
	var validMime = db.Resources.find({
		"mimeType" : _mimeType,
		"sizeLimit" : {$lte : _fileSize}
		});

	return validMime;
}

resources.prototype.addConstraint = function(_mimeType, _sizeLimit)
{
	/**
	*	This assumes that each mimeType has its own fileSize and there is not a global max specified.
	*	If, however, there is, a test should be implemented to ensure that the requested size is smaller or equal to the max.
	*	Field names are in quotes to avoid confusion with js names and prevent errors (apparently works either way).
	*/
	var success = db.Resources.insert({
		"mimeType" : _mimeType,
		"sizeLimit" : _sizeLimit
		});
	
	return success;
}

resources.prototype.removeResourceConstraint = function(constraintID)
{
	/**
	*	Since each _id is unique, it is not necessary to spesify only to remove one.
	*	Fieldnames are in quotes to avoid confusion with js names and prevent errors (apparently works either way).
	*/
	if (db.Resources.find({"_id" : constraintID}))
	{
		db.Resources.remove({"_id" : constraintID});
		return true;
	}
	else
	{
		return false;
	}
}

resources.prototype.updateConstraint = function(constraintID, _sizeLimit)
{
	/**
	*	This assumes that each mimeType has its own fileSize and there is not a global max specified.
	*	If, however, there is, a test should be implemented to ensure that the requested size is smaller or equal to the max.
	*	Field names are in quotes to avoid confusion with js names and prevent errors (apparently works either way).
	*/
	var success = db.Resources.update({"_id" : constraintID}, {$set : {"sizeLimit" : _sizeLimit}})

	return success;
}

/**
*	The following are some functions which I thought are nice ways of handling the file information gathering before uploading it.
*	Theses functions do NOT upload the files, merely check the name, mime-type and file size.
*	Constraints can easily be checked from here on out.
*/

/**
*	Drag and Drop function
*	dropArea is a normal div
*	list2 is and output type object
*/
function dropMultipleFiles(dragAndDropEvent)
{
	dragAndDropEvent.stopPropagation();
	dragAndDropEvent.preventDefault();

	var listOfFiles = dragAndDropEvent.dataTransfer.files;

	var output = [];
	
	for (var i = 0, ffiles; files = listOfFiles[i]; ++i)
	{
		output.push('<li> File Name: ', escape(files.name), '<br/> Mime-type: ', files.type || 'n/a', '<br/> File Size: ', files.size, ' bytes <br/><br/>');
	}
	
	document.getElementById('list2').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(dragAndDropEvent)
{
	dragAndDropEvent.stopPropagation();
	dragAndDropEvent.preventDefault();
	dragAndDropEvent.dataTransfer.dropEffect = 'copy';
}

var drop = document.getElementById('dropArea');
drop.addEventListener('dragover', handleDragOver, false);
drop.addEventListener('drop', dropMultipleFiles, false);

/**
*	Select Multiple Files function
*	fileArea is defined as: "<input type="file" id="fileArea" name="listOfFiles[]" multiple />"
*	list1 is and output type object
*/
function selectMultipleFiles(selectFilesEvent)
{
	var listOfFiles = selectFilesEvent.target.files;

	var output = [];

	for (var i = 0, files; files = listOfFiles[i]; ++i)
	{
		output.push('<li> File Name: ', escape(files.name), '<br/> Mime-type: ', files.type || 'n/a', '<br/> File Size: ', files.size, ' bytes <br/><br/>');
	}

	document.getElementById('list1').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('fileArea').addEventListener('change', selectMultipleFiles, false);
	
	