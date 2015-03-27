//please dont delete this, someone deleted or wrongly merged their git - now my files and folder is lost.

resources.prototype.checkConstraints = function(mimeType, fileSize)
{
	//alternative db.getCollection('Resource_Constraints').find({})
	var fileCheck = db.Resources.find(
	{
		"mimeType" : mimeType,
		"sizeLimit" : {$lt : fileSize}
	});

	/*if(filecheck.fileSize<=fileSize)
		return true;
	else return false;*/

if (fileCheck == null) return false;
else return true;
}

resources.prototype.addConstraint = function(mimeType, sizeLimit)
{
	//alternative db.getCollection('Resource_Constraints').insert({})
	var insertedObject = db.Resources.insert(
	{
		"mimeType" : mimeType,
		"sizeLimit" : sizeLimit
	});
	if (insertedObject == null) return false;
	else return true;
}

resources.prototype.removeResourceConstraint = function(constraintID)
{
	//alternative db.getCollection('Resource_Constraints').remove({})
	if (db.Resources.find({"id" : constraintID}))
	{
		db.Resources.remove({"id" : constraintID});
		return true;
	}
	else
		return false;
}

resources.prototype.updateConstraint = function(constraintID, sizeLimit)
{
	//alternative db.getCollection('Resource_Constraints').update({})
	var updatedObj = db.Resources.update(
		{
			"id" : constraintID}, {$set : {"sizeLimit" : sizeLimit}
		});

	if(updatedObj == null) return false;
	else return true;
}