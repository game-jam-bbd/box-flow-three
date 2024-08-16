export class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.backgroundMusic = null;
        this.isPlaying = false;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this._muted = false;
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
            throw error; // Re-throw the error to be caught in the main game logic
        }
    }
    

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    playBackgroundMusic() {
        if (this.backgroundMusic && !this.isPlaying) {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.backgroundMusic;
            source.connect(this.gainNode);
            source.loop = true;
            source.start();
            this.isPlaying = true;
        }
    }

    stopBackgroundMusic() {
        if (this.isPlaying) {
            this.gainNode.disconnect();
            this.audioContext.close();
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.isPlaying = false;
        }
    }

    mute() {
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this._muted = true;
    }

    unmute() {
        this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
        this._muted = false;
    }

    isMuted() {
        return this._muted;
    }
}
