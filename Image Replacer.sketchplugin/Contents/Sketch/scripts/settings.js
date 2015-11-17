Settings = function(context) {
	var scriptPath = context.scriptPath.substring(0, context.scriptPath.indexOf('\.sketchplugin/') + 1)
	this.prefFile =  scriptPath + "sketchplugin/Contents/Resources/preferences.plist"
}

Settings.prototype.set = function(key, value) {
	var dictionary = [NSMutableDictionary dictionaryWithContentsOfFile:this.prefFile];
	[dictionary setObject:value forKey:key]
	[dictionary writeToFile:this.prefFile atomically:true]
}

Settings.prototype.get = function(key) {
  	var dictionary = [NSMutableDictionary dictionaryWithContentsOfFile:this.prefFile];
  	return [dictionary objectForKey:key]
}