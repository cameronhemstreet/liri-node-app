require("dotenv").config();

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var axios = require("axios");

var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var artistsName = function(artist) {
  return artist.name;
};

var spotifySearch = function(songName) {
  if (songName === undefined) {
    songName = "The Sign";
  }


  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist(s): " + songs[i].artists.map(artistsName));
        console.log("Song Name: " + songs[i].name);
        console.log("Preview Song: " + songs[i].preview_url);
        console.log("Album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};

var bandsInTown = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryURL).then(
    function(response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        console.log("Nothing found for " + artist);
        return;
      }

      console.log("Concerts coming up for " + artist + ":");

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

        console.log(
          show.venue.name + ", " +
            show.venue.city + ", " +
            (show.venue.region || show.venue.country) +
            " at " + 
            moment(show.datetime).format("MM/DD/YYYY")
        );
      }
    }
  );
};

var findMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  var urlHit =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

  axios.get(urlHit).then(
    function(response) {
      var jsonData = response.data;

      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  );
};

// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// Function for determining which command is executed
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "concert-this":
    bandsInTown(functionData);
    break;
  case "spotify-this-song":
    spotifySearch(functionData);
    break;
  case "movie-this":
    findMovie(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));
