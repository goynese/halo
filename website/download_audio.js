// Script to download Halo soundtrack files
const fs = require('fs');
const path = require('path');
const https = require('https');

// Audio tracks to download
const audioTracks = [
    {
        title: "Halo Main Theme",
        file: "halo_main_theme.mp3",
        url: "https://vgmsite.com/soundtracks/halo-combat-evolved-2001-gamerip/jfvtxzqpvs/01%20-%20Opening%20Suite.mp3"
    },
    {
        title: "A Walk in the Woods",
        file: "a_walk_in_the_woods.mp3",
        url: "https://vgmsite.com/soundtracks/halo-combat-evolved-2001-gamerip/qdvtcxwpqt/08%20-%20A%20Walk%20in%20the%20Woods.mp3"
    },
    {
        title: "Rock Anthem for Saving the World",
        file: "rock_anthem_for_saving_the_world.mp3",
        url: "https://vgmsite.com/soundtracks/halo-combat-evolved-2001-gamerip/qdvtcxwpqt/05%20-%20Rock%20Anthem%20for%20Saving%20the%20World.mp3"
    },
    {
        title: "Under Cover of Night",
        file: "under_cover_of_night.mp3",
        url: "https://vgmsite.com/soundtracks/halo-combat-evolved-2001-gamerip/qdvtcxwpqt/03%20-%20Under%20Cover%20of%20Night.mp3"
    },
    {
        title: "The Gun Pointed at the Head of the Universe",
        file: "the_gun_pointed_at_the_head_of_the_universe.mp3",
        url: "https://vgmsite.com/soundtracks/halo-combat-evolved-2001-gamerip/qdvtcxwpqt/02%20-%20The%20Gun%20Pointed%20at%20the%20Head%20of%20the%20Universe.mp3"
    }
];

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Download function
function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        
        https.get(url, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download file: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
            
            file.on('error', err => {
                fs.unlink(filePath, () => {}); // Delete the file if there's an error
                reject(err);
            });
        }).on('error', err => {
            fs.unlink(filePath, () => {}); // Delete the file if there's an error
            reject(err);
        });
    });
}

// Download all tracks
async function downloadAllTracks() {
    console.log('Starting download of Halo soundtrack files...');
    
    for (const track of audioTracks) {
        const filePath = path.join(audioDir, track.file);
        
        console.log(`Downloading ${track.title}...`);
        try {
            await downloadFile(track.url, filePath);
            console.log(`✓ Downloaded ${track.title}`);
        } catch (error) {
            console.error(`✗ Error downloading ${track.title}:`, error.message);
        }
    }
    
    console.log('Download process completed.');
}

// Run the download
downloadAllTracks(); 