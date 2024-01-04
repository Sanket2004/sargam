var m = document.createElement('meta');
m.name = 'theme-color';
m.content = '#808080';
document.head.appendChild(m);

var currentlyPlayingAudio = null;
var init = document.getElementById('initialBody');
var page = 1
var loadBtn = document.querySelector('.loadBtn');

document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the "Load more" button

    loadBtn.addEventListener('click', loadMore);

});

function searchOnEnter(event) {
    if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
}

async function searchSong() {
    var searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        alert('Please enter a song name');
        return;
    }
    init.style.display = 'none';

    showLoadingIndicator();

    var apiUrl = "https://saavn.me/search/songs?query=";
    try {
        var response = await fetch(apiUrl + encodeURIComponent(searchTerm) + "&page=" + page);
        var jsonData = await response.json();
        loadBtn.style.display = 'block';

        hideLoadingIndicator();

        var resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '';

        jsonData.data.results.forEach(function (song) {
            var songElement = document.createElement('div');
            songElement.classList.add('song-container');
            songElement.onclick = async function () {
                await openModal(song.downloadUrl[4].link, song.name, song.primaryArtists, song.image[2].link);
            };
            init.innerHTML = null;
            songElement.innerHTML = `
            <div class="results__items">
                <img src="${song.image[2].link}" alt="${song.name}">
                <div class="song__details">
                <h3>${song.name}</h3>
                <p>Album: ${song.album.name}</p>
                <p>Artists: ${song.primaryArtists}</p>
                <p>Year: ${song.year}</p>
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
        alert(error);
    }

}

async function loadMore() {
    page++;
    await searchSong();
    // Scroll to the top after loading more results
    $("html, body").animate({ scrollTop: 0 }, 350);
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

function openModal(songUrl, songName, songArtist, songImg) {
    var modal = document.getElementById('modal');
    var modalAudio = document.getElementById('modalAudio');
    var audioName = document.getElementById('audio__name');
    var audioArtist = document.getElementById('audio__artist');
    var audioImg = document.getElementById('audio__img');

    modalAudio.src = songUrl;
    audioImg.src = songImg;
    audioName.innerHTML = songName
    audioArtist.innerHTML = songArtist
    modal.style.display = 'flex';

    // Assign a function reference to downloadBtn.onclick
    downloadBtn.onclick = function () {
        downloadSong(songUrl, songName, songArtist);
    };
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

var downloadBtn = document.getElementById('downloadBtn');

async function downloadSong(url, songName, artist) {
    try {
        const res = await fetch(url);
        const file = await res.blob();

        let tempUrl = URL.createObjectURL(file);
        const aTag = document.createElement('a');

        if (url) {
            aTag.href = tempUrl;
            aTag.download = songName + ' - ' + artist + '.mp3'; // Replace 'customFileName' with the desired file name
            document.body.appendChild(aTag);
            aTag.click();
            downloadBtn.innerText = 'Downloading...';
            URL.revokeObjectURL(tempUrl);
            aTag.remove();
            downloadBtn.innerText = 'Download';
        } else {
            console.error('URL is undefined or null');
        }
    } catch (error) {
        console.error('Error downloading song:', error);
        downloadBtn.innerText = error;
    }
}


function selectAllText() {
    var inputField = document.getElementById("searchInput");
    inputField.select();
}
