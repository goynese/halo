// Halo: Combat Evolved Short Stories - Audio Player

// Audio tracks from Halo: Combat Evolved
const audioTracks = [
    {
        title: "Halo Main Theme",
        file: "halo_main_theme.mp3",
        duration: 258
    },
    {
        title: "A Walk in the Woods",
        file: "a_walk_in_the_woods.mp3",
        duration: 189
    },
    {
        title: "Rock Anthem for Saving the World",
        file: "rock_anthem_for_saving_the_world.mp3",
        duration: 217
    },
    {
        title: "Under Cover of Night",
        file: "under_cover_of_night.mp3",
        duration: 232
    },
    {
        title: "The Gun Pointed at the Head of the Universe",
        file: "the_gun_pointed_at_the_head_of_the_universe.mp3",
        duration: 210
    }
];

// Initialize audio player
document.addEventListener('DOMContentLoaded', function() {
    // Create audio player UI
    createAudioPlayer();
    
    // Initialize audio functionality
    initializeAudio();
    
    // Load saved volume setting
    loadVolumeSettings();
});

// Create audio player UI
function createAudioPlayer() {
    const audioPlayerHTML = `
        <div id="audio-player" class="audio-player">
            <div class="audio-controls">
                <button id="audio-toggle" class="audio-button">
                    <span class="audio-icon">♫</span>
                </button>
                <div class="audio-info">
                    <span id="track-title">Halo Soundtrack</span>
                    <div class="volume-control">
                        <input type="range" id="volume-slider" min="0" max="100" value="30">
                    </div>
                </div>
            </div>
            <div id="audio-playlist" class="audio-playlist">
                ${audioTracks.map((track, index) => `
                    <div class="playlist-item" data-index="${index}">
                        <span class="track-name">${track.title}</span>
                        <span class="track-duration">${formatTime(track.duration)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Create audio player container
    const audioPlayerContainer = document.createElement('div');
    audioPlayerContainer.innerHTML = audioPlayerHTML;
    
    // Add to body
    document.body.appendChild(audioPlayerContainer);
    
    // Add audio element
    const audioElement = document.createElement('audio');
    audioElement.id = 'background-audio';
    audioElement.loop = false;
    document.body.appendChild(audioElement);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .audio-player {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(10, 14, 20, 0.8);
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            padding: 10px;
            z-index: 1000;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            transition: all 0.3s ease;
            max-width: 300px;
        }
        
        .audio-controls {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .audio-button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.3s ease;
        }
        
        .audio-button:hover {
            background-color: var(--secondary-color);
            color: var(--dark-bg);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .audio-icon {
            font-size: 18px;
        }
        
        .audio-info {
            flex-grow: 1;
        }
        
        #track-title {
            display: block;
            font-family: var(--title-font);
            font-size: 0.9rem;
            color: var(--secondary-color);
            margin-bottom: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .volume-control {
            width: 100%;
        }
        
        #volume-slider {
            width: 100%;
            height: 4px;
            -webkit-appearance: none;
            background: linear-gradient(to right, var(--secondary-color) 0%, var(--secondary-color) 30%, var(--primary-color) 30%, var(--primary-color) 100%);
            outline: none;
            border-radius: 2px;
        }
        
        #volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--secondary-color);
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
        }
        
        .audio-playlist {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .audio-player.expanded .audio-playlist {
            max-height: 200px;
            overflow-y: auto;
        }
        
        .playlist-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 5px;
            border-bottom: 1px solid rgba(0, 255, 255, 0.1);
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .playlist-item:hover {
            background-color: rgba(0, 127, 204, 0.2);
        }
        
        .playlist-item.active {
            background-color: rgba(0, 127, 204, 0.3);
            border-left: 3px solid var(--secondary-color);
            padding-left: 7px;
        }
        
        .track-name {
            font-size: 0.85rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }
        
        .track-duration {
            font-size: 0.8rem;
            color: rgba(224, 224, 224, 0.7);
        }
        
        /* Minimized state */
        .audio-player.minimized {
            width: 50px;
            height: 50px;
            overflow: hidden;
            padding: 7px;
            border-radius: 50%;
        }
        
        .audio-player.minimized .audio-info,
        .audio-player.minimized .audio-playlist {
            display: none;
        }
        
        .audio-player.minimized .audio-controls {
            margin-bottom: 0;
        }
        
        .audio-player.minimized .audio-button {
            margin-right: 0;
        }
        
        @media (max-width: 768px) {
            .audio-player {
                bottom: 10px;
                right: 10px;
                max-width: 250px;
            }
        }
        
        @media (max-width: 480px) {
            .audio-player {
                max-width: 200px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize audio functionality
function initializeAudio() {
    const audioPlayer = document.getElementById('audio-player');
    const audioToggle = document.getElementById('audio-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const trackTitle = document.getElementById('track-title');
    const audioElement = document.getElementById('background-audio');
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    let currentTrackIndex = 0;
    let isPlaying = false;
    
    // Toggle audio player expanded/minimized state
    audioToggle.addEventListener('click', function() {
        if (audioPlayer.classList.contains('minimized')) {
            // Expand
            audioPlayer.classList.remove('minimized');
            setTimeout(() => {
                audioPlayer.classList.toggle('expanded');
            }, 300);
        } else {
            // Toggle playlist
            audioPlayer.classList.toggle('expanded');
            
            // Toggle play/pause if not expanded
            if (!audioPlayer.classList.contains('expanded')) {
                togglePlayPause();
            }
        }
    });
    
    // Double click to minimize
    audioPlayer.addEventListener('dblclick', function(e) {
        if (e.target.closest('.playlist-item') || e.target.closest('#volume-slider')) {
            return; // Don't minimize when clicking playlist items or volume slider
        }
        audioPlayer.classList.remove('expanded');
        audioPlayer.classList.toggle('minimized');
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        audioElement.volume = volume;
        
        // Update slider background
        this.style.background = `linear-gradient(to right, var(--secondary-color) 0%, var(--secondary-color) ${this.value}%, var(--primary-color) ${this.value}%, var(--primary-color) 100%)`;
        
        // Save volume setting
        localStorage.setItem('haloAudioVolume', volume);
    });
    
    // Playlist item click
    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentTrackIndex = index;
            loadAndPlayTrack(index);
            
            // Update active class
            playlistItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load and play track
    function loadAndPlayTrack(index) {
        const track = audioTracks[index];
        audioElement.src = `../audio/${track.file}`;
        trackTitle.textContent = track.title;
        
        audioElement.play().then(() => {
            isPlaying = true;
            audioToggle.innerHTML = '<span class="audio-icon">❚❚</span>'; // Pause icon
        }).catch(error => {
            console.error('Error playing audio:', error);
            // If audio fails to play, we might be missing the file
            trackTitle.textContent = 'Audio unavailable';
        });
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            audioElement.pause();
            isPlaying = false;
            audioToggle.innerHTML = '<span class="audio-icon">♫</span>'; // Play icon
        } else {
            if (audioElement.src) {
                audioElement.play();
                isPlaying = true;
                audioToggle.innerHTML = '<span class="audio-icon">❚❚</span>'; // Pause icon
            } else {
                // No track loaded yet, load the first one
                loadAndPlayTrack(currentTrackIndex);
            }
        }
    }
    
    // Handle track ending
    audioElement.addEventListener('ended', function() {
        // Play next track
        currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
        loadAndPlayTrack(currentTrackIndex);
        
        // Update active class
        playlistItems.forEach(i => i.classList.remove('active'));
        playlistItems[currentTrackIndex].classList.add('active');
    });
    
    // Initialize with first track
    playlistItems[0].classList.add('active');
    
    // Auto-start audio with low volume (if allowed by browser)
    document.addEventListener('click', function audioInitializer() {
        loadAndPlayTrack(currentTrackIndex);
        document.removeEventListener('click', audioInitializer);
    }, { once: true });
}

// Load saved volume settings
function loadVolumeSettings() {
    const volumeSlider = document.getElementById('volume-slider');
    const audioElement = document.getElementById('background-audio');
    
    // Get saved volume or use default
    const savedVolume = localStorage.getItem('haloAudioVolume');
    const volume = savedVolume !== null ? parseFloat(savedVolume) : 0.3;
    
    // Set audio volume
    audioElement.volume = volume;
    volumeSlider.value = volume * 100;
    
    // Update slider background
    volumeSlider.style.background = `linear-gradient(to right, var(--secondary-color) 0%, var(--secondary-color) ${volumeSlider.value}%, var(--primary-color) ${volumeSlider.value}%, var(--primary-color) 100%)`;
}

// Helper function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
} 