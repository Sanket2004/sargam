var currentlyPlayingAudio = null;
var init = document.getElementById('initialBody');

init.innerHTML='Search your favourite song..'

async function searchSong() {
    var searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        alert('Please enter a song name');
        return;
    }

    showLoadingIndicator();

    var apiUrl = "https://saavn.me/search/songs?query=";
    try {
        var response = await fetch(apiUrl + encodeURIComponent(searchTerm));
        var jsonData = await response.json();

        hideLoadingIndicator();

        var resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '';

        jsonData.data.results.forEach(function (song) {
            var songElement = document.createElement('div');
            songElement.classList.add('song-container');
            songElement.onclick = async function () {
               await openModal(song.downloadUrl[4].link, song.name, song.primaryArtists);
            };
            init.innerHTML = null;
            songElement.innerHTML = `
            <div class="results__items">
                <img src="${song.image[1].link}" alt="${song.name}">
                <div class="song__details">
                <h3>${song.name}</h3>
                <p>Album: ${song.album.name}</p>
                <p>Artists: ${song.primaryArtists}</p>
                <p>Year: ${song.year}</p>
                <hr>
                </div>
            </div>
            `;
            resultsContainer.appendChild(songElement);
        });

        if (resultsContainer.children.length === 0) {
            resultsContainer.innerHTML = '<p>No results found</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoadingIndicator();
    }
}

function playAudio(songUrl) {
    var modalAudio = document.getElementById('modalAudio');

    // Remove previous 'play' event listener to prevent duplicates
    modalAudio.removeEventListener('play', updateCurrentlyPlaying);

    modalAudio.src = songUrl;

    // Add an event listener for the 'play' event
    modalAudio.addEventListener('play', updateCurrentlyPlaying);

    if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
    }
    currentlyPlayingAudio = modalAudio;
    modalAudio.play();
}

function updateCurrentlyPlaying() {
    var currentlyPlayingDiv = document.getElementById('currentlyPlaying');
    if (currentlyPlayingAudio) {
        var currentlyPlayingSong = currentlyPlayingAudio.src.split('/').pop();
        currentlyPlayingDiv.innerText = 'Currently Playing: ' + currentlyPlayingSong;
    } else {
        currentlyPlayingDiv.innerText = '';
    }
}

function openModal(songUrl, songName, songArtist) {
    var modal = document.getElementById('modal');
    var modalAudio = document.getElementById('modalAudio');
    var audioName = document.getElementById('audio__name');
    var audioArtist = document.getElementById('audio__artist');

    modalAudio.src = songUrl;
    audioName.innerHTML = songName
    audioArtist.innerHTML = songArtist
    modal.style.display = 'flex';
}

function closeModal() {
    var modal = document.getElementById('modal');
    var modalAudio = document.getElementById('modalAudio');

    modalAudio.pause();
    modal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
    var modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
};

function showLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById('loadingIndicator').style.display = 'none';
}
