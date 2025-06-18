/* ========================================
   AUDIO MODULE
   Clean Code Architecture - Evangelismo Online
   ======================================== */

window.BackgroundAudio = {
    // Private properties
    _backgroundMusic: null,
    _isPlaying: false,
    _isMuted: false,
    _volume: 0.3, // Volume padrão (30%)    // Initialize audio system
    init() {
        console.log('Inicializando sistema de áudio...');
        this._createAudioElement();
        this._setupEventListeners();
        this._createControls();
        
        // Tenta reproduzir após um pequeno delay
        setTimeout(() => {
            this.play();
        }, 1000);
    },    // Play background music
    play() {
        console.log('Tentando reproduzir áudio...');
        if (this._backgroundMusic && !this._isPlaying) {
            console.log('Estado do áudio:', {
                readyState: this._backgroundMusic.readyState,
                networkState: this._backgroundMusic.networkState,
                src: this._backgroundMusic.src,
                duration: this._backgroundMusic.duration
            });
            
            this._backgroundMusic.play()
                .then(() => {
                    console.log('Áudio reproduzindo com sucesso!');
                    this._isPlaying = true;
                    this._updatePlayButton();
                })
                .catch(error => {
                    console.log('Erro ao reproduzir áudio:', error);
                    if (error.name === 'NotAllowedError') {
                        console.log('Autoplay bloqueado pelo navegador');
                        this._showPlayPrompt();
                    } else {
                        console.error('Outro erro:', error);
                    }
                });
        } else {
            console.log('Condições para reprodução não atendidas:', {                hasAudio: !!this._backgroundMusic,
                isPlaying: this._isPlaying
            });
        }
    },

    // Pause background music
    pause() {
        if (this._backgroundMusic && this._isPlaying) {
            this._backgroundMusic.pause();
            this._isPlaying = false;
            this._updatePlayButton();
        }
    },

    // Toggle play/pause
    toggle() {
        if (this._isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    // Mute/unmute audio
    toggleMute() {
        if (this._backgroundMusic) {
            this._isMuted = !this._isMuted;
            this._backgroundMusic.muted = this._isMuted;
            this._updateMuteButton();
        }
    },

    // Set volume (0-1)
    setVolume(volume) {
        this._volume = Math.max(0, Math.min(1, volume));
        if (this._backgroundMusic) {
            this._backgroundMusic.volume = this._volume;
        }
        this._updateVolumeSlider();
    },    // Private Methods
    _createAudioElement() {
        console.log('Criando elemento de áudio...');
        this._backgroundMusic = document.createElement('audio');
        this._backgroundMusic.src = 'assets/audio/background-music.mp3';
        this._backgroundMusic.loop = true;
        this._backgroundMusic.volume = this._volume;
        this._backgroundMusic.preload = 'auto';
        this._backgroundMusic.crossOrigin = 'anonymous';
        
        console.log('Elemento de áudio criado:', this._backgroundMusic);
        console.log('Caminho do áudio:', this._backgroundMusic.src);
    },_setupEventListeners() {
        if (this._backgroundMusic) {
            this._backgroundMusic.addEventListener('loadstart', () => {
                console.log('Iniciando carregamento do áudio...');
            });

            this._backgroundMusic.addEventListener('loadeddata', () => {
                console.log('Áudio carregado com sucesso!');
            });

            this._backgroundMusic.addEventListener('canplaythrough', () => {
                console.log('Áudio pronto para reprodução');
            });

            this._backgroundMusic.addEventListener('ended', () => {
                this._isPlaying = false;
                this._updatePlayButton();
            });

            this._backgroundMusic.addEventListener('error', (e) => {
                console.error('Erro ao carregar áudio:', e);
                console.error('Código do erro:', this._backgroundMusic.error?.code);
                console.error('Mensagem do erro:', this._backgroundMusic.error?.message);
                this._showAudioError();
            });

            this._backgroundMusic.addEventListener('play', () => {
                console.log('Áudio iniciou a reprodução');
                this._isPlaying = true;
                this._updatePlayButton();
            });

            this._backgroundMusic.addEventListener('pause', () => {
                console.log('Áudio pausado');
                this._isPlaying = false;
                this._updatePlayButton();
            });
        }
    },    _createControls() {
        const audioControls = document.createElement('div');
        audioControls.className = 'audio-controls';
        audioControls.innerHTML = `
            <button id="playPauseBtn" class="audio-btn" title="Reproduzir/Pausar música">
                <i class="fas fa-play"></i>
            </button>
            <button id="muteBtn" class="audio-btn" title="Silenciar">
                <i class="fas fa-volume-up"></i>
            </button>
            <input type="range" id="volumeSlider" min="0" max="100" value="${this._volume * 100}" 
                   class="volume-slider" title="Volume">
        `;

        document.body.appendChild(audioControls);
        this._bindControlEvents();
    },    _bindControlEvents() {
        const playBtn = document.getElementById('playPauseBtn');
        const muteBtn = document.getElementById('muteBtn');
        const volumeSlider = document.getElementById('volumeSlider');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.toggle());
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
    },

    _updatePlayButton() {
        const playBtn = document.getElementById('playPauseBtn');
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            if (icon) {
                icon.className = this._isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
        }
    },

    _updateMuteButton() {
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            const icon = muteBtn.querySelector('i');
            if (icon) {
                icon.className = this._isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
        }
    },

    _updateVolumeSlider() {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this._volume * 100;
        }
    },    _showPlayPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'audio-prompt';
        prompt.innerHTML = `
            <div class="audio-prompt-content">
                <i class="fas fa-music"></i>
                <p>Deseja reproduzir música de fundo?</p>
                <button onclick="AudioManager.play(); this.parentElement.parentElement.remove();">
                    Sim, reproduzir
                </button>
                <button onclick="this.parentElement.parentElement.remove();">
                    Não, obrigado
                </button>
            </div>
        `;
        document.body.appendChild(prompt);
    },

    _showAudioError() {
        console.error('Arquivo de música não encontrado ou não pode ser carregado');
        const controls = document.querySelector('.audio-controls');
        if (controls) {
            controls.style.display = 'none';
        }
        
        // Mostra mensagem de erro temporária
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
        `;
        errorMsg.textContent = 'Erro ao carregar música de fundo';
        document.body.appendChild(errorMsg);
        
        setTimeout(() => {
            if (errorMsg.parentNode) {
                errorMsg.parentNode.removeChild(errorMsg);
            }
        }, 5000);
    }
};

// Global functions for HTML events
window.AudioManager = window.BackgroundAudio;

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.BackgroundAudio.init());
} else {
    window.BackgroundAudio.init();
}
