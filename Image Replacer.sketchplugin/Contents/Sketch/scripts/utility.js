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

function replaceWithImages(images, context) {
    selection = context.selection;
    for(var i = 0; i < [selection count]; i++) {

    var image = [[NSImage alloc] initByReferencingFile:images[i]];
    var layer = selection[i];
        if([layer class] == MSShapeGroup){
            var fill = layer.style().fills().firstObject();
            fill.setFillType(4);                
            var coll = layer.style().fills().firstObject().documentData().images();              
            [fill setPatternImage:image collection:coll]
            layer.style().fills().firstObject().setPatternFillType(1);
        }
    }

  if([selection count] == 0) [doc showMessage:'Select at least one vector shape'];;

}

function getFilesAndReplace(directory, context) {
    var fileTypes = [NSArray arrayWithObjects:@"png", @"PNG", @"jpg", @"JPG", @"jpeg", @"JPEG", @"gif", @"GIF", nil];
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
          log(imageFileNames[i])
      }
      replaceWithImages(imageFileNames, context);
      if(context.selection.count() == 0) [doc showMessage:'Select at least one vector shape'];
  }

}
