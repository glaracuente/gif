// Initial array of topics
var topics = ["Mario", "Luigi", "Bowser", "Donkey Kong"];
var currentTopic = "";
var offset = 0;

// Function for generating button html code 
function renderButtons() {
    console.log("renderButtons")
    $("#topics").empty()

    for (var i = 0; i < topics.length; i++) {
        var newButton = $("<button>").text(topics[i])
        newButton.addClass("topicButton")
        $("#topics").append(newButton)
    }

}





// Function for generating more GIFs on the page
function renderGIFs(term) {
    console.log("renderGIFs")

    // Constructing a URL to search Giphy for topic that was clicked on
    var apiKey = "XdsOhqx5uXnzfVmZTVpmV4KWzHKV70bV"
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        term + "&api_key=" + apiKey + "&limit=10&offset=" + offset;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var results = response.data;

            for (var i = 0; i < results.length; i++) {
                var topicImage = $("<img>")
                topicImage.data("staticGIF", results[i].images.fixed_height_still.url)
                topicImage.data("movingGIF", results[i].images.fixed_height.url)
                topicImage.data("state", "static")
                topicImage.attr("src", topicImage.data("staticGIF"));
                topicImage.addClass("gif")

                var rating = $("<p>").text("Rating: " + results[i].rating)

                var downloadButton = $("<button>").addClass("dlbtn fa fa-download")          

                var gifDiv = $("<div>").addClass("gif");
                gifDiv.append(topicImage)
                gifDiv.append(rating)
                gifDiv.append(downloadButton)
                $("#gifs-appear-here").prepend(gifDiv);
            }
        });

}



function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

$(document).on('click', ".dlbtn", function () {
    var dataURL = "http://images6.fanpop.com/image/photos/37100000/amazing-siderman-marvel-live-action-movies-37161341-1920-1080.jpg";
    downloadURI(dataURL, 'my.gif');
    //download(dataURL, "my.gif", "image/webp");
});

// Function for the user to add a new topic 
$(document).on("click", '#add-topic', function (event) {
    event.preventDefault();

    var userInput = $("#topic-input").val();
    if (userInput.length === 0) {
        return
    }
    topics.push(userInput)

    renderButtons();
});

// Calling the renderButtons function to display the initial list of topics
renderButtons();



// Event listener for all topicButtons
$(document).on("click", '.topicButton', function () {
    currentTopic = $(this).text()
    offset = 0
    $("#gifs-appear-here").empty()
    renderGIFs(currentTopic)
});

// Function to add more gifs
$("#moreGIFs").on("click", function () {
    if (currentTopic === "") {
        return;
    }
    else {
        offset+=10
        renderGIFs(currentTopic)
    }
});


// Function to change from static to moving and vice versa
$(document).on("click", '.gif', function () {
    var state = $(this).data("state");

    if (state === "static") {
        $(this).attr("src", $(this).data("movingGIF"));
        $(this).data("state", "moving");
    } else {
        $(this).attr("src", $(this).data("staticGIF"));
        $(this).data("state", "static");
    }
});






//download.js v4.2, by dandavis; 2008-2016. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.download = factory();
  }
}(this, function () {

	return function download(data, strFileName, strMimeType) {

		var self = window, // this script is only for browsers anyway...
			defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
			mimeType = strMimeType || defaultMime,
			payload = data,
			url = !strFileName && !strMimeType && payload,
			anchor = document.createElement("a"),
			toString = function(a){return String(a);},
			myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
			fileName = strFileName || "download",
			blob,
			reader;
			myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
	  
		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			payload=[payload, mimeType];
			mimeType=payload[0];
			payload=payload[1];
		}


		if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
			fileName = url.split("/").pop().split("?")[0];
			anchor.href = url; // assign href prop to temp anchor
		  	if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
        		var ajax=new XMLHttpRequest();
        		ajax.open( "GET", url, true);
        		ajax.responseType = 'blob';
        		ajax.onload= function(e){ 
				  download(e.target.response, fileName, defaultMime);
				};
        		setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
			    return ajax;
			} // end if valid url?
		} // end if url?


		//go ahead and download dataURLs right away
		if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)){
		
			if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
				payload=dataUrlToBlob(payload);
				mimeType=payload.type || defaultMime;
			}else{			
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
					saver(payload) ; // everyone else can save dataURLs un-processed
			}
			
		}//end if dataURL passed?

		blob = payload instanceof myBlob ?
			payload :
			new myBlob([payload], {type: mimeType}) ;


		function dataUrlToBlob(strUrl) {
			var parts= strUrl.split(/[:;,]/),
			type= parts[1],
			decoder= parts[2] == "base64" ? atob : decodeURIComponent,
			binData= decoder( parts.pop() ),
			mx= binData.length,
			i= 0,
			uiArr= new Uint8Array(mx);

			for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

			return new myBlob([uiArr], {type: type});
		 }

		function saver(url, winMode){

			if ('download' in anchor) { //html5 A[download]
				anchor.href = url;
				anchor.setAttribute("download", fileName);
				anchor.className = "download-js-link";
				anchor.innerHTML = "downloading...";
				anchor.style.display = "none";
				document.body.appendChild(anchor);
				setTimeout(function() {
					anchor.click();
					document.body.removeChild(anchor);
					if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
				}, 66);
				return true;
			}

			// handle non-a[download] safari as best we can:
			if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
				url=url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
				if(!window.open(url)){ // popup blocked, offer direct download:
					if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
				}
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = document.createElement("iframe");
			document.body.appendChild(f);

			if(!winMode){ // force a mime that will download:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			}
			f.src=url;
			setTimeout(function(){ document.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fileName);
		}

		if(self.URL){ // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		}else{
			// handle non-Blob()+non-URL browsers:
			if(typeof blob === "string" || blob.constructor===toString ){
				try{
					return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
				}catch(y){
					return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
				}
			}

			// Blob but not URL support:
			reader=new FileReader();
			reader.onload=function(e){
				saver(this.result);
			};
			reader.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */
}));