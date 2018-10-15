// Initial array of terms
var terms = ["Mario", "Luigi", "Bowser", "Donkey Kong"];

// Function for generating button html code 
function renderButtons() {
    console.log("renderButtons")
    $("#terms").empty()

    for (var i = 0; i < terms.length; i++) {
        var newButton = $("<button>").text(terms[i])
        newButton.addClass("termButton")
        $("#terms").append(newButton)
    }

}

// Function for the user to add a new term 
$(document).on("click", '#add-term', function (event) {
    event.preventDefault();

    var userInput = $("#term-input").val();
    terms.push(userInput)

    renderButtons();
});

// Calling the renderButtons function to display the initial list of terms
renderButtons();





/////////////////////
// Event listener for all button elements
$(document).on("click", '.termButton', function () {
    console.log($(this).text())
    var termApi = $(this).text();

    // Constructing a URL to search Giphy for term that was clicked on
    var apiKey = "XdsOhqx5uXnzfVmZTVpmV4KWzHKV70bV"
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        termApi + "&api_key=" + apiKey + "&limit=10";

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
                    var termImage = $("<img>");
                    termImage.attr("src", results[i].images.fixed_height.url);
                    gifDiv.append(t);
                    gifDiv.append(termImage);
                    $("#gifs-appear-here").prepend(gifDiv);
                }
            }
        });
});
///////////////////////////








//<img src="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" data-still="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" data-animate="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200.gif" data-state="still" class="gif">
$(".gif").on("click", function () {
    // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
    var state = $(this).attr("data-state");
    // If the clicked image's state is still, update its src attribute to what its data-animate value is.
    // Then, set the image's data-state to animate
    // Else set src to the data-still value
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

