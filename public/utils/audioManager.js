export class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.backgroundMusic = null;
        this.isPlaying = false;
    }

    async loadBackgroundMusic(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.backgroundMusic = audioBuffer;
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
