var upload = function() {
    var photo = document.getElementById("file");
    // the file is the first element in the files property
    var file = photo.files[0];

    console.log("File name: " + file.fileName);
    console.log("File size: " + file.fileSize);
    console.log("Binary content: " + file.getAsBinary());
    console.log("Text content: " + file.getAsText(""));
    // or
    // console.log("Text content: " + file.getAsText("utf8"));

    return false;
};