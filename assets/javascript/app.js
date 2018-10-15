// Initial array of topics
var topics = ["Mario", "Luigi", "Bowser", "Donkey Kong"];

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

// Function for the user to add a new topic 
$(document).on("click", '#add-topic', function(event) {
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
$(document).on("click", '.topicButton', function() {
    console.log($(this).text())
    var topicApi = $(this).text();

    // Constructing a URL to search Giphy for topic that was clicked on
    var apiKey = "XdsOhqx5uXnzfVmZTVpmV4KWzHKV70bV"
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        topicApi + "&api_key=" + apiKey + "&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var results = response.data;

            for (var i = 0; i < results.length; i++) {

                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                    var gifDiv = $("<div>");
                    var rating = results[i].rating;
                    var t = $("<p>").text("Rating: " + rating);
                    var topicImage = $("<img>");
                    topicImage.data("staticGIF", results[i].images.fixed_height_still.url);
                    topicImage.data("movingGIF", results[i].images.fixed_height.url);
                    topicImage.data("state", "static");
                    topicImage.attr("src", topicImage.data("staticGIF"));
                    topicImage.addClass("gif")
                    
                    gifDiv.append(t);
                    gifDiv.append(topicImage);
                    $("#gifs-appear-here").prepend(gifDiv);
                }
            }
        });
});




// Function to change from static to moving and vice versa
$(document).on("click", '.gif', function() {
    var state = $(this).data("state");
   
    if (state === "static") {
        $(this).attr("src", $(this).data("movingGIF"));
        $(this).data("state", "moving");
    } else {
        $(this).attr("src", $(this).data("staticGIF"));
        $(this).data("state", "static");
    }
});

