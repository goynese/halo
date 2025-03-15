// Script to generate all story pages from the template and story content
const fs = require('fs');
const path = require('path');

// Story data
const stories = [
    {
        id: 1,
        filename: 'story1.html',
        title: 'First Encounter',
        sourceFile: '../short stories/01_first_encounter.txt',
        description: "Master Chief's first battle with the Covenant on the Pillar of Autumn.",
        date: 'September 19, 2552',
        location: 'UNSC Pillar of Autumn, in orbit around Installation 04',
        subject: 'First engagement with Covenant boarding parties',
        prev: { link: '../index.html', title: 'Back to Home' },
        next: { link: 'story2.html', title: 'Next Story: Beach Assault' }
    },
    {
        id: 2,
        filename: 'story2.html',
        title: 'Beach Assault',
        sourceFile: '../short stories/02_silent_cartographer.txt',
        description: "The iconic Silent Cartographer beach landing, where UNSC forces establish a beachhead on Halo.",
        date: 'September 20, 2552',
        location: 'Installation 04, Island Facility',
        subject: 'Operation: CARTOGRAPHER - Beach landing and facility infiltration',
        prev: { link: 'story1.html', title: 'Previous Story: First Encounter' },
        next: { link: 'story3.html', title: 'Next Story: Flood Reveal' }
    },
    {
        id: 3,
        filename: 'story3.html',
        title: 'Flood Reveal',
        sourceFile: '../short stories/03_flood_reveal.txt',
        description: "The terrifying first encounter with the Flood parasite that would change everything.",
        date: 'September 21, 2552',
        location: 'Installation 04, Containment Facility',
        subject: 'First contact with unknown parasitic organism',
        prev: { link: 'story2.html', title: 'Previous Story: Beach Assault' },
        next: { link: 'story4.html', title: 'Next Story: Warthog Escape' }
    },
    {
        id: 4,
        filename: 'story4.html',
        title: 'Race Against Time',
        sourceFile: '../short stories/04_warthog_escape.txt',
        description: "The final Warthog escape sequence as Master Chief races to escape the exploding Halo ring.",
        date: 'September 22, 2552',
        location: 'Installation 04, Pillar of Autumn crash site',
        subject: 'Final evacuation and ring destruction',
        prev: { link: 'story3.html', title: 'Previous Story: Flood Reveal' },
        next: { link: 'story5.html', title: 'Next Story: The Oracle\'s Duty' }
    },
    {
        id: 5,
        filename: 'story5.html',
        title: 'The Oracle\'s Duty',
        sourceFile: '../short stories/05_guilty_spark.txt',
        description: "343 Guilty Spark's perspective on the events of Halo and his ancient duty.",
        date: 'Unknown (Monitor log)',
        location: 'Installation 04, Control Facilities',
        subject: 'Monitor 343 Guilty Spark\'s observations and actions',
        prev: { link: 'story4.html', title: 'Previous Story: Race Against Time' },
        next: { link: 'story6.html', title: 'Next Story: Honor and Heresy' }
    },
    {
        id: 6,
        filename: 'story6.html',
        title: 'Honor and Heresy',
        sourceFile: '../short stories/06_covenant_elite.txt',
        description: "A Covenant Elite's experience during the conflict and his growing doubts.",
        date: 'Covenant Battle Calendar, 9th Age of Reclamation',
        location: 'Sacred Ring (Installation 04), Covenant Battlecruiser Truth and Reconciliation',
        subject: 'Field Master Zuka \'Zamamee\'s mission log',
        prev: { link: 'story5.html', title: 'Previous Story: The Oracle\'s Duty' },
        next: { link: 'story7.html', title: 'Next Story: Digital Sentinel' }
    },
    {
        id: 7,
        filename: 'story7.html',
        title: 'Digital Sentinel',
        sourceFile: '../short stories/07_cortana.txt',
        description: "Cortana's unique perspective as an AI navigating both digital and physical threats.",
        date: 'September 20, 2552',
        location: 'Installation 04, Various Locations',
        subject: 'AI CTN 0452-9 (Cortana) - Internal processing log',
        prev: { link: 'story6.html', title: 'Previous Story: Honor and Heresy' },
        next: { link: 'story8.html', title: 'Next Story: The Captain\'s Last Stand' }
    },
    {
        id: 8,
        filename: 'story8.html',
        title: 'The Captain\'s Last Stand',
        sourceFile: '../short stories/08_captain_keyes.txt',
        description: "Captain Jacob Keyes' leadership during the crisis and his ultimate sacrifice.",
        date: 'September 19-21, 2552',
        location: 'UNSC Pillar of Autumn and Installation 04',
        subject: 'Captain Jacob Keyes - Command decisions during the Halo incident',
        prev: { link: 'story7.html', title: 'Previous Story: Digital Sentinel' },
        next: { link: 'story9.html', title: 'Next Story: The Sergeant\'s Speech' }
    },
    {
        id: 9,
        filename: 'story9.html',
        title: 'The Sergeant\'s Speech',
        sourceFile: '../short stories/09_sergeant_johnson.txt',
        description: "Sergeant Johnson rallying his Marines in the face of overwhelming odds.",
        date: 'September 20, 2552',
        location: 'Installation 04, Marine Rally Point Alpha',
        subject: 'Sergeant Avery Johnson - Field leadership and morale maintenance',
        prev: { link: 'story8.html', title: 'Previous Story: The Captain\'s Last Stand' },
        next: { link: 'story10.html', title: 'Next Story: Just Another Day in Hell' }
    },
    {
        id: 10,
        filename: 'story10.html',
        title: 'Just Another Day in Hell',
        sourceFile: '../short stories/10_marine_perspective.txt',
        description: "A regular UNSC Marine's perspective on the front lines of the Halo conflict.",
        date: 'September 20, 2552',
        location: 'Installation 04, Forerunner Structure Delta',
        subject: 'PFC Michael Cho - Frontline combat experience',
        prev: { link: 'story9.html', title: 'Previous Story: The Sergeant\'s Speech' },
        next: { link: '../index.html', title: 'Back to Home' }
    }
];

// Template for story pages
function generateStoryPage(story) {
    // Read the story content from the source file
    let storyContent = '';
    try {
        const fileContent = fs.readFileSync(path.resolve(__dirname, story.sourceFile), 'utf8');
        // Remove the title (first line) as we'll use our own formatting
        storyContent = fileContent.split('\n').slice(1).join('\n').trim();
    } catch (err) {
        console.error(`Error reading story file ${story.sourceFile}:`, err);
        storyContent = 'Story content not available.';
    }

    // Convert the story content to HTML paragraphs
    const paragraphs = storyContent.split('\n\n').map(p => `<p>${p}</p>`).join('\n                 ');

    // Generate the navigation links
    let navigationHtml = '<div class="story-navigation">';
    
    if (story.prev) {
        navigationHtml += `<a href="${story.prev.link}" class="nav-button">${story.prev.title}</a>`;
    } else {
        navigationHtml += `<span></span>`;
    }
    
    navigationHtml += `<a href="../index.html" class="nav-button">Home</a>`;
    
    if (story.next) {
        navigationHtml += `<a href="${story.next.link}" class="nav-button">${story.next.title}</a>`;
    } else {
        navigationHtml += `<span></span>`;
    }
    
    navigationHtml += '</div>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${story.title} - Halo: Combat Evolved Short Stories</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../images/minecraft.png" type="image/png">
    <meta name="description" content="${story.description}">
</head>
<body>
    <div class="container">
        <header>
            <h1 class="logo">Halo: Combat Evolved</h1>
            <p class="subtitle">Short Stories from the Ring World</p>
            <nav>
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li${story.id === 1 ? ' class="active"' : ''}><a href="story1.html">First Encounter</a></li>
                    <li${story.id === 2 ? ' class="active"' : ''}><a href="story2.html">Beach Assault</a></li>
                    <li${story.id === 3 ? ' class="active"' : ''}><a href="story3.html">Flood Reveal</a></li>
                    <li${story.id === 4 ? ' class="active"' : ''}><a href="story4.html">Warthog Escape</a></li>
                    <li${story.id === 5 ? ' class="active"' : ''}><a href="story5.html">Guilty Spark</a></li>
                    <li${story.id === 6 ? ' class="active"' : ''}><a href="story6.html">Covenant Elite</a></li>
                    <li${story.id === 7 ? ' class="active"' : ''}><a href="story7.html">Cortana</a></li>
                    <li${story.id === 8 ? ' class="active"' : ''}><a href="story8.html">Captain Keyes</a></li>
                    <li${story.id === 9 ? ' class="active"' : ''}><a href="story9.html">Sergeant Johnson</a></li>
                    <li${story.id === 10 ? ' class="active"' : ''}><a href="story10.html">Marine's Story</a></li>
                    <li><a href="../about.html">About</a></li>
                </ul>
            </nav>
        </header>

        <div class="horizontal-line"></div>

        <main>
            <section class="story-content">
                <h2 class="story-title">${story.title}</h2>
                
                <div class="data-section">
                    <h3 class="data-title">UNSC ARCHIVES // MISSION LOG</h3>
                    <p>Date: ${story.date}</p>
                    <p>Location: ${story.location}</p>
                    <p>Subject: ${story.subject}</p>
                </div>
                
                ${paragraphs}
                
                ${navigationHtml}
            </section>
        </main>

        <footer>
            <p>&copy; 2023 Halo: Combat Evolved Short Stories | Fan Fiction Collection</p>
        </footer>
    </div>

    <script src="../js/main.js"></script>
    <script src="../js/audio.js"></script>
    <script src="../js/minigames.js"></script>
</body>
</html>`;
}

// Generate all story pages
stories.forEach(story => {
    const htmlContent = generateStoryPage(story);
    const outputPath = path.resolve(__dirname, 'pages', story.filename);
    
    try {
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`Generated ${story.filename}`);
    } catch (err) {
        console.error(`Error writing file ${story.filename}:`, err);
    }
});

console.log('All story pages generated successfully!'); 