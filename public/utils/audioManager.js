export class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.backgroundMusic = null;
        this.isPlaying = false;
    }

    async loadBackgroundMusic(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            this.backgroundMusic = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error("Error loading audio:", error);
            // Optionally, set a flag or call a method to handle the error in the game
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic && !this.isPlaying) {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.backgroundMusic;
            source.connect(this.audioContext.destination);
            source.loop = true;
            source.start();
            this.isPlaying = true;
        }
    }

    stopBackgroundMusic() {
        if (this.isPlaying) {
            this.audioContext.close();
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isPlaying = false;
        }
    }
}
