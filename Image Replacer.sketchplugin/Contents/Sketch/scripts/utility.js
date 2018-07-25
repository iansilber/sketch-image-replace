function shuffle(array) {
  var currentIndex = array.count(), temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function showFileBrowserAndRequireDirectory(requireDirectory) {
  var fileTypes = [NSArray arrayWithArray:["png", "jpg", "gif", "jpeg"]];
  var panel = [NSOpenPanel openPanel];
  var imageFileNames = [];
  if (requireDirectory == true) {
    [panel setCanChooseFiles:false];  
  } else {
    [panel setCanChooseFiles:true];  
  }
  
  [panel setCanChooseDirectories:true];
  [panel setAllowsMultipleSelection:true]; // yes if more than one dir is allowed
  [panel setAllowedFileTypes:fileTypes];

  var response = [panel runModal];
  return {response: response, panel: panel}
}

function replaceWithImages(images, context) {
    selection = context.selection;
    for(var i = 0; i < [selection count]; i++) {
      var data = [NSData dataWithContentsOfFile:images[i]]
      var image = [[MSImageData alloc] initWithData:data sha:nil];
      var layer = selection[i];
      if ([layer class] == MSShapeGroup) {

        var fill = layer.style().fills().firstObject()
        [fill setFillType:4]
        [fill setImage:image]
        layer.style().fills().firstObject().setPatternFillType(1);
      }
    }
  if([selection count] == 0) [doc showMessage:'Select at least one vector shape'];;

}

function getFilesAndReplace(directory, context) {
    var fileTypes = [NSArray arrayWithArray:["png", "PNG", "jpg", "JPG", "jpeg", "JPEG", "gif", "GIF"]];
    var fileManager = [NSFileManager defaultManager];
    var files = [fileManager contentsOfDirectoryAtPath:directory error:nil];
    var imageFileNames = [[files filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"pathExtension IN %@", fileTypes]] mutableCopy]
    var count = imageFileNames.count();

    if (count == 0) {
      var doc = context.document
        [doc showMessage:"The directory does not contain any images"]
    } else {

      shuffle(imageFileNames);
      for (var i = 0; i < context.selection.count(); i++) {
          imageFileNames[i] = directory + "/" + imageFileNames[i];
      }
      replaceWithImages(imageFileNames, context);
      if(context.selection.count() == 0) [doc showMessage:'Select at least one vector shape'];
  }

}
