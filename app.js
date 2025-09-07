/**
 * QR Learning by Education Media - Enhanced QR Code Learning Application
 * Features: Multiple camera support, image capture, advanced feedback, data persistence
 * Version: 3.0 - Fixed Navigation
 */

class QRLearningAdvanced {
    constructor() {
        // Enhanced configuration
        this.config = {
            appName: "QR Learning Advanced",
            version: "3.0",
            scannerConfig: {
                fps: 15,
                qrbox: { width: 300, height: 300 },
                aspectRatio: 1.0,
                disableFlip: false,
                experimentalFeatures: true,
                verbose: false
            },
            cameraConfig: {
                preferredResolution: { width: 1280, height: 720 },
                autoFocus: true,
                torch: false,
                zoom: 1.0
            },
            messages: {
                scanSuccess: "✅ QR Code berhasil dibaca:",
                correctAnswer: "🎉 Benar! +{points} poin. Lanjut ke langkah berikutnya",
                wrongAnswer: "❌ Jawaban salah. Jawaban yang benar adalah:",
                tryAgain: "💡 Coba scan QR code yang berbeda. Hint:",
                completed: "🏆 Selamat! Anda telah menyelesaikan semua langkah dengan sempurna!",
                scanError: "⚠️ QR Code tidak terdeteksi, pastikan QR code terlihat jelas",
                cameraOn: "📹 Kamera Menyala",
                cameraOff: "📹 Kamera Mati",
                scanPrompt: "📱 Arahkan kamera ke QR code",
                imageCaptured: "📸 Gambar berhasil ditangkap",
                cameraError: "❌ Error mengakses kamera. Pastikan permission diberikan."
            },
            achievements: [
                {
                    id: "first_scan",
                    title: "Pemindai Pertama",
                    description: "Berhasil melakukan scan QR pertama",
                    icon: "🎯",
                    points: 5
                },
                {
                    id: "perfect_run",
                    title: "Sempurna!",
                    description: "Menyelesaikan semua langkah tanpa kesalahan",
                    icon: "⭐",
                    points: 50
                },
                {
                    id: "speed_demon",
                    title: "Kilat",
                    description: "Menyelesaikan dalam waktu kurang dari 2 menit",
                    icon: "⚡",
                    points: 30
                },
                {
                    id: "photographer",
                    title: "Fotografer",
                    description: "Menangkap 5+ gambar selama pembelajaran",
                    icon: "📸",
                    points: 20
                }
            ]
        };

        // Enhanced default questions
        this.defaultQuestions = [
            {
                id: "q1",
                step: 1,
                question: "Scan QR code yang berisi kata 'START'",
                correctAnswer: "START",
                description: "Langkah pertama: Temukan dan scan QR code yang berisi kata START untuk memulai pembelajaran",
                hints: ["Pastikan QR code terlihat jelas", "Kata harus dalam huruf kapital"],
                points: 10
            },
            {
                id: "q2", 
                step: 2,
                question: "Scan QR code yang berisi angka '123'",
                correctAnswer: "123",
                description: "Langkah kedua: Temukan dan scan QR code yang berisi angka 123 untuk melanjutkan",
                hints: ["Angka harus berurutan", "Tidak ada spasi atau karakter lain"],
                points: 15
            },
            {
                id: "q3",
                step: 3,
                question: "Scan QR code yang berisi kata 'MIDDLE'", 
                correctAnswer: "MIDDLE",
                description: "Langkah ketiga: Scan QR code yang berisi kata MIDDLE",
                hints: ["Kata tengah dari proses pembelajaran", "Dalam huruf kapital"],
                points: 20
            },
            {
                id: "q4",
                step: 4,
                question: "Scan QR code yang berisi kata 'FINISH'", 
                correctAnswer: "FINISH",
                description: "Langkah terakhir: Temukan dan scan QR code yang berisi kata FINISH untuk menyelesaikan pembelajaran",
                hints: ["Kata penutup pembelajaran", "Pastikan semua huruf kapital"],
                points: 25
            }
        ];

        // Enhanced application state
        this.state = {
            currentPage: 'landing',
            currentQuestionIndex: 0,
            isScanning: false,
            isCameraOn: false,
            scanner: null,
            availableCameras: [],
            selectedCameraId: null,
            questions: [],
            editingQuestionId: null,
            deletingQuestionId: null,
            sessionData: {
                startTime: null,
                score: 0,
                attempts: 0,
                correctAnswers: 0,
                hintsUsed: 0,
                capturedImages: [],
                achievements: []
            },
            learningHistory: [],
            statistics: {
                totalCompletions: 0,
                bestScore: 0,
                bestTime: null,
                totalImages: 0
            }
        };

        this.sessionTimerInterval = null;
        
        console.log('QRLearningAdvanced instance created');
    }

    async init() {
        console.log('Initializing QR Learning Advanced...');
        
        try {
            // Load all data
            this.loadQuestions();
            this.loadStatistics();
            this.loadLearningHistory();
            
            // Initialize camera system
            await this.initializeCameraSystem();
            
            // Bind all event listeners
            this.bindEvents();
            
            // Initialize router
            this.router();
            
            // Check Html5QrcodeScanner availability
            if (typeof Html5QrcodeScanner === 'undefined') {
                console.warn('Html5QrcodeScanner library not loaded');
                this.showToast('Library QR scanner belum dimuat, beberapa fitur mungkin terbatas', 'warning');
            }

            console.log('QR Learning Advanced initialized successfully');
            this.showToast('Aplikasi berhasil dimuat!', 'success');
            
        } catch (error) {
            console.error('Error during initialization:', error);
            this.showToast('Error saat inisialisasi aplikasi', 'error');
        }
    }

    // =================== ENHANCED DATA MANAGEMENT ===================
    
    loadQuestions() {
        try {
            const savedQuestions = localStorage.getItem('qrlearning_advanced_questions');
            if (savedQuestions) {
                this.state.questions = JSON.parse(savedQuestions);
                console.log('Questions loaded from localStorage:', this.state.questions.length);
            } else {
                this.state.questions = [...this.defaultQuestions];
                this.saveQuestions();
                console.log('Default questions loaded');
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            this.state.questions = [...this.defaultQuestions];
            this.showToast('Error loading data, menggunakan data default', 'error');
        }
    }

    saveQuestions() {
        try {
            localStorage.setItem('qrlearning_advanced_questions', JSON.stringify(this.state.questions));
            console.log('Questions saved to localStorage');
        } catch (error) {
            console.error('Error saving questions:', error);
            this.showToast('Error saving data', 'error');
        }
    }

    loadStatistics() {
        try {
            const savedStats = localStorage.getItem('qrlearning_advanced_statistics');
            if (savedStats) {
                this.state.statistics = { ...this.state.statistics, ...JSON.parse(savedStats) };
                console.log('Statistics loaded:', this.state.statistics);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    saveStatistics() {
        try {
            localStorage.setItem('qrlearning_advanced_statistics', JSON.stringify(this.state.statistics));
            console.log('Statistics saved');
        } catch (error) {
            console.error('Error saving statistics:', error);
        }
    }

    loadLearningHistory() {
        try {
            const savedHistory = localStorage.getItem('qrlearning_advanced_history');
            if (savedHistory) {
                this.state.learningHistory = JSON.parse(savedHistory);
                console.log('Learning history loaded:', this.state.learningHistory.length);
            }
        } catch (error) {
            console.error('Error loading learning history:', error);
        }
    }

    saveLearningHistory() {
        try {
            // Keep only last 20 sessions
            if (this.state.learningHistory.length > 20) {
                this.state.learningHistory = this.state.learningHistory.slice(-20);
            }
            localStorage.setItem('qrlearning_advanced_history', JSON.stringify(this.state.learningHistory));
            console.log('Learning history saved');
        } catch (error) {
            console.error('Error saving learning history:', error);
        }
    }

    generateQuestionId() {
        return 'q' + Date.now() + Math.random().toString(36).substr(2, 5);
    }

    addQuestion(questionText, correctAnswer, description = '', hints = [], points = 10) {
        const newQuestion = {
            id: this.generateQuestionId(),
            step: this.state.questions.length + 1,
            question: questionText.trim(),
            correctAnswer: correctAnswer.trim(),
            description: description.trim(),
            hints: Array.isArray(hints) ? hints.filter(h => h.trim()) : [],
            points: Math.max(1, Math.min(100, parseInt(points) || 10))
        };

        this.state.questions.push(newQuestion);
        this.saveQuestions();
        this.renderQuestionsTable();
        this.showToast('Soal berhasil ditambahkan!', 'success');
        
        console.log('Question added:', newQuestion);
        return newQuestion;
    }

    updateQuestion(id, questionText, correctAnswer, description = '', hints = [], points = 10) {
        const questionIndex = this.state.questions.findIndex(q => q.id === id);
        if (questionIndex !== -1) {
            this.state.questions[questionIndex] = {
                ...this.state.questions[questionIndex],
                question: questionText.trim(),
                correctAnswer: correctAnswer.trim(),
                description: description.trim(),
                hints: Array.isArray(hints) ? hints.filter(h => h.trim()) : [],
                points: Math.max(1, Math.min(100, parseInt(points) || 10))
            };
            
            this.saveQuestions();
            this.renderQuestionsTable();
            this.showToast('Soal berhasil diperbarui!', 'success');
            
            console.log('Question updated:', this.state.questions[questionIndex]);
            return true;
        }
        return false;
    }

    deleteQuestion(id) {
        const questionIndex = this.state.questions.findIndex(q => q.id === id);
        if (questionIndex !== -1) {
            const deletedQuestion = this.state.questions.splice(questionIndex, 1)[0];
            
            // Update step numbers
            this.state.questions.forEach((q, index) => {
                q.step = index + 1;
            });
            
            this.saveQuestions();
            this.renderQuestionsTable();
            this.showToast('Soal berhasil dihapus!', 'success');
            
            console.log('Question deleted:', deletedQuestion);
            return true;
        }
        return false;
    }

    clearAllQuestions() {
        this.state.questions = [...this.defaultQuestions];
        this.saveQuestions();
        this.renderQuestionsTable();
        this.showToast('Semua soal telah dihapus dan dikembalikan ke default', 'success');
    }

    exportData() {
        try {
            const exportData = {
                questions: this.state.questions,
                statistics: this.state.statistics,
                history: this.state.learningHistory,
                exportDate: new Date().toISOString(),
                version: this.config.version
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-learning-data-${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Data berhasil diekspor!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Error mengekspor data', 'error');
        }
    }

    // =================== ENHANCED CAMERA SYSTEM ===================

    async initializeCameraSystem() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.warn('Camera API not supported');
                return;
            }

            // Get available cameras
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.state.availableCameras = devices.filter(device => device.kind === 'videoinput');
            
            console.log('Available cameras:', this.state.availableCameras.length);
            
            if (this.state.availableCameras.length > 0) {
                // Select default camera (prefer back camera)
                const backCamera = this.state.availableCameras.find(camera => 
                    camera.label.toLowerCase().includes('back') || 
                    camera.label.toLowerCase().includes('rear')
                );
                
                this.state.selectedCameraId = backCamera ? backCamera.deviceId : this.state.availableCameras[0].deviceId;
                
                // Populate camera selection dropdown
                this.populateCameraSelection();
            }

        } catch (error) {
            console.error('Error initializing camera system:', error);
        }
    }

    populateCameraSelection() {
        const cameraSelect = document.getElementById('cameraSelect');
        if (!cameraSelect) return;

        cameraSelect.innerHTML = '';
        
        if (this.state.availableCameras.length === 0) {
            cameraSelect.innerHTML = '<option value="">Tidak ada kamera tersedia</option>';
            return;
        }

        this.state.availableCameras.forEach((camera, index) => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.textContent = camera.label || `Kamera ${index + 1}`;
            if (camera.deviceId === this.state.selectedCameraId) {
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        });

        this.showElement('cameraSelection');
    }

    // =================== EVENT HANDLERS ===================

    bindEvents() {
        console.log('Binding enhanced events...');
        
        try {
            // Landing page events
            this.bindLandingEvents();
            // Learning page events
            this.bindLearningEvents();
            // Results page events
            this.bindResultsEvents();
            // Admin page events
            this.bindAdminEvents();
            // Modal events
            this.bindModalEvents();
            // Global events
            this.bindGlobalEvents();

            console.log('Events bound successfully');
        } catch (error) {
            console.error('Error binding events:', error);
            this.showToast('Error binding events', 'error');
        }
    }

    bindLandingEvents() {
        console.log('Binding landing events...');
        
        const startLearningBtn = document.getElementById('startLearningBtn');
        if (startLearningBtn) {
            startLearningBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start learning clicked');
                this.navigateToPage('learning');
            });
            console.log('Start learning button bound');
        }

        const adminDashboardBtn = document.getElementById('adminDashboardBtn');
        if (adminDashboardBtn) {
            adminDashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Admin dashboard clicked');
                this.navigateToPage('admin');
            });
            console.log('Admin dashboard button bound');
        }

        const resultsPageBtn = document.getElementById('resultsPageBtn');
        if (resultsPageBtn) {
            resultsPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Results page clicked');
                this.navigateToPage('results');
            });
            console.log('Results page button bound');
        }
    }

    bindLearningEvents() {
        console.log('Binding learning events...');
        
        const backToHomeBtn = document.getElementById('backToHomeBtn');
        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopScanner();
                this.navigateToPage('landing');
            });
        }

        const cameraSelect = document.getElementById('cameraSelect');
        if (cameraSelect) {
            cameraSelect.addEventListener('change', (e) => {
                this.state.selectedCameraId = e.target.value;
                if (this.state.isScanning) {
                    this.restartCamera();
                }
            });
        }

        const turnOnCameraBtn = document.getElementById('turnOnCameraBtn');
        if (turnOnCameraBtn) {
            turnOnCameraBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.turnOnCamera();
            });
        }

        const turnOffCameraBtn = document.getElementById('turnOffCameraBtn');
        if (turnOffCameraBtn) {
            turnOffCameraBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.turnOffCamera();
            });
        }

        const captureImageBtn = document.getElementById('captureImageBtn');
        if (captureImageBtn) {
            captureImageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.captureImage();
            });
        }

        const downloadImageBtn = document.getElementById('downloadImageBtn');
        if (downloadImageBtn) {
            downloadImageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadCapturedImage();
            });
        }

        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextQuestion();
            });
        }

        const showHintsBtn = document.getElementById('showHintsBtn');
        if (showHintsBtn) {
            showHintsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showHints();
            });
        }

        const restartLearningBtn = document.getElementById('restartLearningBtn');
        if (restartLearningBtn) {
            restartLearningBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetLearning();
            });
        }

        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetLearning();
            });
        }

        const viewResultsBtn = document.getElementById('viewResultsBtn');
        if (viewResultsBtn) {
            viewResultsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('results');
            });
        }

        const backToHomeFromCompletionBtn = document.getElementById('backToHomeFromCompletionBtn');
        if (backToHomeFromCompletionBtn) {
            backToHomeFromCompletionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('landing');
            });
        }
    }

    bindResultsEvents() {
        const backToHomeFromResultsBtn = document.getElementById('backToHomeFromResultsBtn');
        if (backToHomeFromResultsBtn) {
            backToHomeFromResultsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('landing');
            });
        }
    }

    bindAdminEvents() {
        console.log('Binding admin events...');
        
        const backToHomeFromAdminBtn = document.getElementById('backToHomeFromAdminBtn');
        if (backToHomeFromAdminBtn) {
            backToHomeFromAdminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('landing');
            });
        }

        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportData();
            });
        }

        const testQuestionsBtn = document.getElementById('testQuestionsBtn');
        if (testQuestionsBtn) {
            testQuestionsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage('learning');
            });
        }

        const addQuestionForm = document.getElementById('addQuestionForm');
        if (addQuestionForm) {
            addQuestionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddQuestion();
            });
        }

        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showElement('clearAllModal');
            });
        }
    }

    bindModalEvents() {
        // Edit modal
        const closeEditModalBtn = document.getElementById('closeEditModalBtn');
        if (closeEditModalBtn) {
            closeEditModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeEditModal();
            });
        }

        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeEditModal();
            });
        }

        const saveEditBtn = document.getElementById('saveEditBtn');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSaveEdit();
            });
        }

        // Delete modal
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDeleteModal();
            });
        }

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleConfirmDelete();
            });
        }

        // Clear all modal
        const cancelClearAllBtn = document.getElementById('cancelClearAllBtn');
        if (cancelClearAllBtn) {
            cancelClearAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideElement('clearAllModal');
            });
        }

        const confirmClearAllBtn = document.getElementById('confirmClearAllBtn');
        if (confirmClearAllBtn) {
            confirmClearAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearAllQuestions();
                this.hideElement('clearAllModal');
            });
        }

        // Close modals when clicking outside
        const modals = ['editModal', 'deleteModal', 'clearAllModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target.id === modalId) {
                        this.hideElement(modalId);
                    }
                });
            }
        });
    }

    bindGlobalEvents() {
        // Page visibility change - stop scanner when tab is not active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state.isScanning) {
                console.log('Page hidden, stopping scanner...');
                this.stopScanner();
                this.updateCameraStatus(false);
            }
        });
    }

    // =================== NAVIGATION & ROUTING ===================

    router() {
        console.log('Initializing router');
        this.showPage(this.state.currentPage);
    }

    navigateToPage(pageName) {
        console.log('Navigating to page:', pageName);
        
        // Stop scanner when leaving learning page
        if (this.state.currentPage === 'learning' && this.state.isScanning) {
            this.stopScanner();
        }
        
        // Stop timer if leaving learning page
        if (this.state.currentPage === 'learning' && this.sessionTimerInterval) {
            clearInterval(this.sessionTimerInterval);
            this.sessionTimerInterval = null;
        }
        
        this.state.currentPage = pageName;
        this.showPage(pageName);
        
        // Initialize page-specific data
        try {
            if (pageName === 'learning') {
                this.initializeLearning();
            } else if (pageName === 'admin') {
                this.initializeAdmin();
            } else if (pageName === 'results') {
                this.initializeResults();
            }
        } catch (error) {
            console.error('Error initializing page:', error);
            this.showToast('Error saat memuat halaman', 'error');
        }
        
        this.showToast(`Navigasi ke ${pageName} berhasil`, 'success');
        console.log('Navigation completed to:', pageName);
    }

    showPage(pageName) {
        console.log('Showing page:', pageName);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Page shown:', pageName);
        } else {
            console.error('Page not found:', pageName + 'Page');
            this.showToast('Halaman tidak ditemukan', 'error');
        }
    }

    // =================== LEARNING PAGE ===================

    initializeLearning() {
        console.log('Initializing enhanced learning page...');
        
        // Reset session data
        this.state.sessionData = {
            startTime: new Date(),
            score: 0,
            attempts: 0,
            correctAnswers: 0,
            hintsUsed: 0,
            capturedImages: [],
            achievements: []
        };
        
        // Reset learning state
        this.state.currentQuestionIndex = 0;
        this.state.isScanning = false;
        this.state.isCameraOn = false;
        
        // Start session timer
        this.startSessionTimer();
        
        // Update UI
        this.updateQuestion();
        this.updateProgress();
        this.updateCameraStatus(false);
        this.hideElement('scannerSection');
        this.hideElement('feedbackSection');
        this.hideElement('nextStepBtn');
        this.hideElement('completionSection');
        this.hideElement('imagePreviewSection');
        this.hideElement('hintsSection');
        this.showElement('turnOnCameraBtn');
        this.hideElement('turnOffCameraBtn');
        this.hideElement('captureImageBtn');
        
        console.log('Enhanced learning page initialized');
    }

    startSessionTimer() {
        if (this.sessionTimerInterval) {
            clearInterval(this.sessionTimerInterval);
        }

        this.sessionTimerInterval = setInterval(() => {
            if (this.state.sessionData.startTime) {
                const elapsed = Date.now() - this.state.sessionData.startTime.getTime();
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                const timerElement = document.getElementById('sessionTimer');
                if (timerElement) {
                    timerElement.textContent = timeString;
                }
            }
        }, 1000);
    }

    updateQuestion() {
        if (this.state.currentQuestionIndex >= this.state.questions.length) {
            this.showCompletion();
            return;
        }

        const currentQuestion = this.state.questions[this.state.currentQuestionIndex];
        const currentStep = this.state.currentQuestionIndex + 1;

        // Update question display
        const elements = {
            currentStep: document.getElementById('currentStep'),
            questionText: document.getElementById('questionText'),
            questionDescription: document.getElementById('questionDescription')
        };

        if (elements.currentStep) elements.currentStep.textContent = currentStep;
        if (elements.questionText) elements.questionText.textContent = currentQuestion.question;
        if (elements.questionDescription) elements.questionDescription.textContent = currentQuestion.description;

        // Hide hints initially
        this.hideElement('hintsSection');

        console.log('Question updated:', currentQuestion);
    }

    updateProgress() {
        const totalQuestions = this.state.questions.length;
        const currentStep = this.state.currentQuestionIndex + 1;
        const progressPercentage = (this.state.currentQuestionIndex / totalQuestions) * 100;

        const elements = {
            progressText: document.getElementById('progressText'),
            progressPercentage: document.getElementById('progressPercentage'),
            progressFill: document.getElementById('progressFill'),
            scoreDisplay: document.getElementById('scoreDisplay')
        };

        if (elements.progressText) elements.progressText.textContent = `Langkah ${currentStep} dari ${totalQuestions}`;
        if (elements.progressPercentage) elements.progressPercentage.textContent = `${Math.round(progressPercentage)}%`;
        if (elements.progressFill) elements.progressFill.style.width = `${progressPercentage}%`;
        if (elements.scoreDisplay) elements.scoreDisplay.textContent = `Skor: ${this.state.sessionData.score}`;
    }

    showHints() {
        if (this.state.currentQuestionIndex >= this.state.questions.length) return;
        
        const currentQuestion = this.state.questions[this.state.currentQuestionIndex];
        if (!currentQuestion.hints || currentQuestion.hints.length === 0) {
            this.showToast('Tidak ada petunjuk untuk soal ini', 'info');
            return;
        }

        const hintsList = document.getElementById('hintsList');
        if (hintsList) {
            hintsList.innerHTML = '';
            currentQuestion.hints.forEach(hint => {
                const li = document.createElement('li');
                li.textContent = hint;
                hintsList.appendChild(li);
            });
        }

        this.showElement('hintsSection');
        this.state.sessionData.hintsUsed++;
        this.showToast('Petunjuk ditampilkan', 'info');
    }

    // =================== CAMERA & SCANNER ===================

    async turnOnCamera() {
        if (this.state.isScanning) {
            console.log('Camera already on');
            return;
        }

        console.log('Turning on enhanced camera...');

        try {
            if (typeof Html5QrcodeScanner === 'undefined') {
                throw new Error('Html5QrcodeScanner not available');
            }

            // Update UI immediately
            this.showElement('turnOffCameraBtn');
            this.showElement('captureImageBtn');
            this.hideElement('turnOnCameraBtn');
            this.showElement('scannerSection');
            this.updateCameraStatus(true);

            // Clear existing scanner
            const qrReaderElement = document.getElementById('qr-reader');
            if (qrReaderElement) {
                qrReaderElement.innerHTML = '';
            }

            // Enhanced scanner configuration
            const scannerConfig = {
                fps: this.config.scannerConfig.fps,
                qrbox: this.config.scannerConfig.qrbox,
                aspectRatio: this.config.scannerConfig.aspectRatio,
                rememberLastUsedCamera: true,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 1,
                disableFlip: this.config.scannerConfig.disableFlip
            };

            if (this.state.selectedCameraId) {
                scannerConfig.videoConstraints = {
                    deviceId: { exact: this.state.selectedCameraId }
                };
            }

            // Initialize scanner
            this.state.scanner = new Html5QrcodeScanner("qr-reader", scannerConfig, false);

            // Start scanning
            await this.state.scanner.render(
                (decodedText, decodedResult) => {
                    console.log('QR scan success:', decodedText);
                    this.onScanSuccess(decodedText, decodedResult);
                },
                (error) => {
                    // Only log actual errors, not scanning attempts
                    if (error && !error.includes('No QR code found') && !error.includes('QR code parse error')) {
                        console.warn('Scanner error:', error);
                    }
                }
            );

            this.state.isScanning = true;
            this.state.isCameraOn = true;
            this.showToast(this.config.messages.cameraOn, 'success');
            
            console.log('Enhanced camera started successfully');

        } catch (error) {
            console.error('Error starting camera:', error);
            
            // Reset UI state
            this.hideElement('turnOffCameraBtn');
            this.hideElement('captureImageBtn');
            this.showElement('turnOnCameraBtn');
            this.hideElement('scannerSection');
            this.updateCameraStatus(false);
            
            // Show user-friendly error
            let errorMessage = 'Gagal menghidupkan kamera. ';
            if (error.name === 'NotAllowedError') {
                errorMessage += 'Izin akses kamera ditolak.';
            } else if (error.name === 'NotFoundError') {
                errorMessage += 'Kamera tidak ditemukan.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage += 'Browser tidak mendukung kamera.';
            } else {
                errorMessage += 'Pastikan browser mendukung dan izinkan akses kamera.';
            }
            
            this.showToast(errorMessage, 'error');
        }
    }

    turnOffCamera() {
        console.log('Turning off camera...');
        
        this.stopScanner();
        this.updateCameraStatus(false);
        this.hideElement('scannerSection');
        this.hideElement('turnOffCameraBtn');
        this.hideElement('captureImageBtn');
        this.showElement('turnOnCameraBtn');
        this.state.isCameraOn = false;
        
        this.showToast(this.config.messages.cameraOff, 'info');
    }

    async restartCamera() {
        if (this.state.isScanning) {
            this.stopScanner();
            setTimeout(() => {
                this.turnOnCamera();
            }, 500);
        }
    }

    captureImage() {
        try {
            const video = document.querySelector('#qr-reader video');
            if (!video) {
                this.showToast('Kamera tidak aktif', 'error');
                return;
            }

            // Create canvas to capture image
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Convert to data URL
            const imageDataUrl = canvas.toDataURL('image/png', 0.9);
            this.displayCapturedImage(imageDataUrl);
            
            // Store in session data
            const imageData = {
                url: imageDataUrl,
                timestamp: new Date().toISOString(),
                questionIndex: this.state.currentQuestionIndex
            };
            this.state.sessionData.capturedImages.push(imageData);
            
            this.showToast(this.config.messages.imageCaptured, 'success');
            console.log('Image captured successfully');

        } catch (error) {
            console.error('Error capturing image:', error);
            this.showToast('Error menangkap gambar', 'error');
        }
    }

    displayCapturedImage(imageUrl) {
        const capturedImage = document.getElementById('capturedImage');
        if (capturedImage) {
            capturedImage.src = imageUrl;
            this.showElement('imagePreviewSection');
        }
    }

    downloadCapturedImage() {
        const capturedImage = document.getElementById('capturedImage');
        if (!capturedImage || !capturedImage.src) {
            this.showToast('Tidak ada gambar untuk diunduh', 'error');
            return;
        }

        try {
            const a = document.createElement('a');
            a.href = capturedImage.src;
            a.download = `qr-learning-capture-${new Date().getTime()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            this.showToast('Gambar berhasil diunduh!', 'success');
        } catch (error) {
            console.error('Error downloading image:', error);
            this.showToast('Error mengunduh gambar', 'error');
        }
    }

    stopScanner() {
        if (!this.state.scanner) {
            return;
        }

        try {
            this.state.scanner.clear().then(() => {
                console.log('Scanner cleared successfully');
            }).catch((error) => {
                console.warn('Error clearing scanner:', error);
            });
            
            this.state.scanner = null;
            this.state.isScanning = false;
            
            // Clear scanner element
            const qrReaderElement = document.getElementById('qr-reader');
            if (qrReaderElement) {
                qrReaderElement.innerHTML = '';
            }
            
        } catch (error) {
            console.error('Error stopping scanner:', error);
            this.state.scanner = null;
            this.state.isScanning = false;
            const qrReaderElement = document.getElementById('qr-reader');
            if (qrReaderElement) {
                qrReaderElement.innerHTML = '';
            }
        }
    }

    updateCameraStatus(isOn) {
        const statusElement = document.getElementById('cameraStatus');
        if (statusElement) {
            statusElement.className = `status-indicator ${isOn ? 'active' : 'inactive'}`;
            statusElement.innerHTML = `
                <span class="status-dot"></span>
                ${isOn ? this.config.messages.cameraOn : this.config.messages.cameraOff}
            `;
        }
    }

    onScanSuccess(decodedText, decodedResult) {
        console.log(`QR Code detected: "${decodedText}"`);
        
        // Increment attempts
        this.state.sessionData.attempts++;
        
        // Process the scan immediately
        setTimeout(() => {
            this.validateScan(decodedText);
        }, 100);
    }

    validateScan(scannedText) {
        if (this.state.currentQuestionIndex >= this.state.questions.length) {
            return;
        }

        const currentQuestion = this.state.questions[this.state.currentQuestionIndex];
        const cleanScannedText = scannedText.trim();
        const cleanCorrectAnswer = currentQuestion.correctAnswer.trim();
        const isCorrect = cleanScannedText.toUpperCase() === cleanCorrectAnswer.toUpperCase();

        console.log(`Validating: "${cleanScannedText}" vs "${cleanCorrectAnswer}" = ${isCorrect}`);

        if (isCorrect) {
            // Add score
            this.state.sessionData.score += currentQuestion.points || 10;
            this.state.sessionData.correctAnswers++;
            
            // Auto capture image on correct answer
            if (this.state.isCameraOn) {
                setTimeout(() => this.captureImage(), 500);
            }
        }

        // Show detailed feedback
        this.showDetailedFeedback(cleanScannedText, cleanCorrectAnswer, isCorrect, currentQuestion.points || 10);

        if (isCorrect) {
            // Correct answer
            setTimeout(() => {
                if (this.state.currentQuestionIndex < this.state.questions.length - 1) {
                    this.showElement('nextStepBtn');
                } else {
                    // Last question completed
                    setTimeout(() => this.showCompletion(), 2000);
                }
            }, 1500);
        } else {
            // Wrong answer - hide feedback after a delay
            setTimeout(() => {
                this.hideElement('feedbackSection');
            }, 4000);
        }

        // Update progress
        this.updateProgress();
    }

    showDetailedFeedback(scannedText, correctAnswer, isCorrect, points) {
        const elements = {
            feedbackSection: document.getElementById('feedbackSection'),
            feedbackIcon: document.getElementById('feedbackIcon'),
            feedbackTitle: document.getElementById('feedbackTitle'),
            feedbackMessage: document.getElementById('feedbackMessage'),
            scannedTextSpan: document.getElementById('scannedText'),
            correctAnswerText: document.getElementById('correctAnswerText'),
            pointsValue: document.getElementById('pointsValue')
        };

        if (!elements.feedbackSection) return;

        // Update scanned value
        if (elements.scannedTextSpan) elements.scannedTextSpan.textContent = scannedText;
        this.showElement('scannedValue');

        if (isCorrect) {
            // Success feedback
            elements.feedbackSection.className = 'feedback-section card success';
            if (elements.feedbackIcon) elements.feedbackIcon.textContent = '✅';
            if (elements.feedbackTitle) elements.feedbackTitle.textContent = 'Scan Berhasil!';
            if (elements.feedbackMessage) {
                elements.feedbackMessage.textContent = this.config.messages.correctAnswer.replace('{points}', points);
            }
            if (elements.pointsValue) elements.pointsValue.textContent = `+${points}`;
            this.hideElement('correctAnswer');
            this.showElement('pointsEarned');
            
        } else {
            // Error feedback
            elements.feedbackSection.className = 'feedback-section card error';
            if (elements.feedbackIcon) elements.feedbackIcon.textContent = '❌';
            if (elements.feedbackTitle) elements.feedbackTitle.textContent = 'QR Code Salah';
            if (elements.feedbackMessage) {
                elements.feedbackMessage.innerHTML = `
                    ${this.config.messages.scanSuccess} <strong>"${scannedText}"</strong><br>
                    ${this.config.messages.wrongAnswer}<br>
                    ${this.config.messages.tryAgain}
                `;
            }
            
            // Show correct answer
            if (elements.correctAnswerText) elements.correctAnswerText.textContent = correctAnswer;
            this.showElement('correctAnswer');
            this.hideElement('pointsEarned');
        }

        this.showElement('feedbackSection');
        
        // Add animation
        elements.feedbackSection.classList.add('bounce');
        setTimeout(() => {
            if (elements.feedbackSection) {
                elements.feedbackSection.classList.remove('bounce');
            }
        }, 600);
    }

    nextQuestion() {
        if (this.state.currentQuestionIndex < this.state.questions.length - 1) {
            this.state.currentQuestionIndex++;
            this.updateQuestion();
            this.updateProgress();
            
            // Hide feedback and next button
            this.hideElement('feedbackSection');
            this.hideElement('nextStepBtn');
            
            console.log(`Advanced to question ${this.state.currentQuestionIndex + 1}`);
        }
    }

    showCompletion() {
        // Stop timer
        if (this.sessionTimerInterval) {
            clearInterval(this.sessionTimerInterval);
            this.sessionTimerInterval = null;
        }

        const completionTime = Date.now() - this.state.sessionData.startTime.getTime();
        const minutes = Math.floor(completionTime / 60000);
        const seconds = Math.floor((completionTime % 60000) / 1000);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Calculate achievements
        this.calculateAchievements(completionTime);

        // Update completion stats
        const elements = {
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            progressPercentage: document.getElementById('progressPercentage'),
            totalSteps: document.getElementById('totalSteps'),
            totalScore: document.getElementById('totalScore'),
            completionTime: document.getElementById('completionTime'),
            capturedCount: document.getElementById('capturedCount')
        };

        if (elements.progressFill) elements.progressFill.style.width = '100%';
        if (elements.progressText) elements.progressText.textContent = `Selesai! ${this.state.questions.length} dari ${this.state.questions.length} langkah`;
        if (elements.progressPercentage) elements.progressPercentage.textContent = '100%';
        if (elements.totalSteps) elements.totalSteps.textContent = this.state.questions.length;
        if (elements.totalScore) elements.totalScore.textContent = this.state.sessionData.score;
        if (elements.completionTime) elements.completionTime.textContent = timeString;
        if (elements.capturedCount) elements.capturedCount.textContent = this.state.sessionData.capturedImages.length;

        // Show achievements
        this.displayAchievements();

        // Save session to history
        this.saveSessionToHistory(completionTime);
        
        // Update statistics
        this.updateStatistics(completionTime);
        
        // Hide other sections
        this.hideElement('scannerSection');
        this.hideElement('feedbackSection');
        this.hideElement('nextStepBtn');
        this.hideElement('imagePreviewSection');
        
        // Show completion
        this.showElement('completionSection');
        
        this.showToast(this.config.messages.completed, 'success');
        console.log('All questions completed!');
    }

    calculateAchievements(completionTime) {
        const achievements = [];

        // First scan achievement
        if (this.state.sessionData.attempts > 0) {
            achievements.push(this.config.achievements.find(a => a.id === 'first_scan'));
        }

        // Perfect run achievement
        if (this.state.sessionData.correctAnswers === this.state.questions.length && this.state.sessionData.attempts === this.state.questions.length) {
            achievements.push(this.config.achievements.find(a => a.id === 'perfect_run'));
        }

        // Speed demon achievement
        if (completionTime < 120000) { // Less than 2 minutes
            achievements.push(this.config.achievements.find(a => a.id === 'speed_demon'));
        }

        // Photographer achievement
        if (this.state.sessionData.capturedImages.length >= 5) {
            achievements.push(this.config.achievements.find(a => a.id === 'photographer'));
        }

        this.state.sessionData.achievements = achievements.filter(a => a);
        
        // Add achievement points to score
        this.state.sessionData.achievements.forEach(achievement => {
            this.state.sessionData.score += achievement.points;
        });
    }

    displayAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;

        if (this.state.sessionData.achievements.length === 0) {
            achievementsList.innerHTML = '<p>Tidak ada pencapaian kali ini. Coba lagi untuk mendapatkan badge!</p>';
            return;
        }

        const achievementsHTML = this.state.sessionData.achievements.map(achievement => `
            <div class="achievement-badge">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `).join('');

        achievementsList.innerHTML = achievementsHTML;
    }

    saveSessionToHistory(completionTime) {
        const session = {
            id: Date.now(),
            date: new Date().toISOString(),
            score: this.state.sessionData.score,
            completionTime: completionTime,
            questionsCount: this.state.questions.length,
            attempts: this.state.sessionData.attempts,
            correctAnswers: this.state.sessionData.correctAnswers,
            hintsUsed: this.state.sessionData.hintsUsed,
            imagesCount: this.state.sessionData.capturedImages.length,
            achievements: this.state.sessionData.achievements
        };

        this.state.learningHistory.unshift(session);
        this.saveLearningHistory();
    }

    updateStatistics(completionTime) {
        this.state.statistics.totalCompletions++;
        
        if (this.state.sessionData.score > this.state.statistics.bestScore) {
            this.state.statistics.bestScore = this.state.sessionData.score;
        }
        
        if (!this.state.statistics.bestTime || completionTime < this.state.statistics.bestTime) {
            this.state.statistics.bestTime = completionTime;
        }
        
        this.state.statistics.totalImages += this.state.sessionData.capturedImages.length;
        
        this.saveStatistics();
    }

    resetLearning() {
        console.log('Resetting learning...');
        
        // Stop scanner and timer
        if (this.state.isScanning) {
            this.stopScanner();
            this.updateCameraStatus(false);
        }
        
        if (this.sessionTimerInterval) {
            clearInterval(this.sessionTimerInterval);
            this.sessionTimerInterval = null;
        }
        
        // Reset state
        this.state.currentQuestionIndex = 0;
        this.state.isCameraOn = false;
        
        // Reset session data
        this.state.sessionData = {
            startTime: new Date(),
            score: 0,
            attempts: 0,
            correctAnswers: 0,
            hintsUsed: 0,
            capturedImages: [],
            achievements: []
        };
        
        // Reset UI
        this.hideElement('scannerSection');
        this.hideElement('feedbackSection');
        this.hideElement('completionSection');
        this.hideElement('nextStepBtn');
        this.hideElement('turnOffCameraBtn');
        this.hideElement('captureImageBtn');
        this.hideElement('imagePreviewSection');
        this.hideElement('hintsSection');
        this.showElement('turnOnCameraBtn');
        
        // Restart timer
        this.startSessionTimer();
        
        // Update question and progress
        this.updateQuestion();
        this.updateProgress();
        
        this.showToast('Pembelajaran direset. Mulai dari awal!', 'info');
    }

    // =================== RESULTS PAGE ===================

    initializeResults() {
        console.log('Initializing results page...');
        this.renderResultsStatistics();
        this.renderImageGallery();
        this.renderLearningHistory();
    }

    renderResultsStatistics() {
        const elements = {
            totalCompletions: document.getElementById('totalCompletions'),
            bestScore: document.getElementById('bestScore'),
            bestTime: document.getElementById('bestTime'),
            totalImages: document.getElementById('totalImages')
        };

        if (elements.totalCompletions) elements.totalCompletions.textContent = this.state.statistics.totalCompletions;
        if (elements.bestScore) elements.bestScore.textContent = this.state.statistics.bestScore;
        if (elements.totalImages) elements.totalImages.textContent = this.state.statistics.totalImages;
        
        if (elements.bestTime) {
            if (this.state.statistics.bestTime) {
                const minutes = Math.floor(this.state.statistics.bestTime / 60000);
                const seconds = Math.floor((this.state.statistics.bestTime % 60000) / 1000);
                elements.bestTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                elements.bestTime.textContent = '--:--';
            }
        }
    }

    renderImageGallery() {
        const imageGallery = document.getElementById('imageGallery');
        if (!imageGallery) return;

        // Collect all images from history
        const allImages = [];
        this.state.learningHistory.forEach(session => {
            if (session.imagesCount && session.imagesCount > 0) {
                // For demo purposes, we'll show placeholder images
                // In a real app, you'd store and retrieve actual images
                for (let i = 0; i < session.imagesCount; i++) {
                    allImages.push({
                        date: new Date(session.date).toLocaleDateString(),
                        time: new Date(session.date).toLocaleTimeString(),
                        sessionId: session.id
                    });
                }
            }
        });

        if (allImages.length === 0) {
            imageGallery.innerHTML = `
                <div class="no-images">
                    <p>Belum ada gambar yang ditangkap.</p>
                    <p>Mulai pembelajaran untuk menangkap gambar!</p>
                </div>
            `;
            return;
        }

        const galleryHTML = allImages.map((image, index) => `
            <div class="gallery-item">
                <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; font-size: 48px; color: #999;">
                    📷
                </div>
                <div class="overlay">
                    ${image.date} ${image.time}
                </div>
            </div>
        `).join('');

        imageGallery.innerHTML = galleryHTML;
    }

    renderLearningHistory() {
        const learningHistory = document.getElementById('learningHistory');
        if (!learningHistory) return;

        if (this.state.learningHistory.length === 0) {
            learningHistory.innerHTML = `
                <div class="no-history">
                    <p>Belum ada riwayat pembelajaran.</p>
                </div>
            `;
            return;
        }

        const historyHTML = this.state.learningHistory.map(session => {
            const date = new Date(session.date);
            const minutes = Math.floor(session.completionTime / 60000);
            const seconds = Math.floor((session.completionTime % 60000) / 1000);
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            return `
                <div class="history-item">
                    <div class="history-info">
                        <h4>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</h4>
                        <div class="history-meta">
                            <span>Skor: ${session.score}</span> | 
                            <span>Waktu: ${timeString}</span> | 
                            <span>Benar: ${session.correctAnswers}/${session.questionsCount}</span>
                        </div>
                    </div>
                    <div class="history-stats">
                        <div>📸 ${session.imagesCount || 0}</div>
                        <div>🏅 ${session.achievements ? session.achievements.length : 0}</div>
                    </div>
                </div>
            `;
        }).join('');

        learningHistory.innerHTML = historyHTML;
    }

    // =================== ADMIN PAGE ===================

    initializeAdmin() {
        console.log('Initializing enhanced admin page...');
        this.renderQuestionsTable();
        this.clearAddForm();
    }

    renderQuestionsTable() {
        const tableContainer = document.getElementById('questionsTable');
        const totalCountElement = document.getElementById('totalQuestionsCount');
        
        if (!tableContainer) return;
        
        // Update total count
        if (totalCountElement) {
            totalCountElement.textContent = `Total: ${this.state.questions.length} soal`;
        }
        
        if (this.state.questions.length === 0) {
            tableContainer.innerHTML = `
                <div class="text-center" style="padding: var(--space-32); color: var(--color-text-secondary);">
                    <p>Belum ada soal yang dibuat.</p>
                    <p>Tambahkan soal pertama menggunakan form di atas.</p>
                </div>
            `;
            return;
        }

        const questionsHTML = this.state.questions.map(question => `
            <div class="question-item">
                <div class="question-step">${question.step}</div>
                <div class="question-content">
                    <h4>${this.escapeHtml(question.question)}</h4>
                    <div class="question-meta">
                        <div>
                            <strong>Jawaban: </strong>
                            <span class="answer-display">${this.escapeHtml(question.correctAnswer)}</span>
                        </div>
                        ${question.description ? `
                            <div class="description-display">
                                <strong>Deskripsi: </strong>${this.escapeHtml(question.description)}
                            </div>
                        ` : ''}
                        ${question.hints && question.hints.length > 0 ? `
                            <div class="hints-display">
                                <strong>Petunjuk: </strong>${question.hints.length} petunjuk tersedia
                            </div>
                        ` : ''}
                        <div class="points-display">
                            <strong>Poin: </strong>${question.points || 10} poin
                        </div>
                    </div>
                </div>
                <div class="question-actions">
                    <button class="btn btn--icon btn--edit" onclick="window.app.editQuestion('${question.id}')" title="Edit Soal">
                        ✏️
                    </button>
                    <button class="btn btn--icon btn--delete" onclick="window.app.deleteQuestionConfirm('${question.id}')" title="Hapus Soal">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        tableContainer.innerHTML = questionsHTML;
    }

    clearAddForm() {
        const form = document.getElementById('addQuestionForm');
        if (form) {
            form.reset();
            // Reset points to default
            const pointsInput = document.getElementById('newQuestionPoints');
            if (pointsInput) pointsInput.value = 10;
        }
    }

    handleAddQuestion() {
        const elements = {
            questionText: document.getElementById('newQuestionText'),
            correctAnswer: document.getElementById('newCorrectAnswer'),
            description: document.getElementById('newQuestionDescription'),
            hints: document.getElementById('newQuestionHints'),
            points: document.getElementById('newQuestionPoints')
        };

        if (!elements.questionText || !elements.correctAnswer) {
            this.showToast('Form elements not found', 'error');
            return;
        }

        const questionText = elements.questionText.value;
        const correctAnswer = elements.correctAnswer.value;
        const description = elements.description ? elements.description.value : '';
        const hintsText = elements.hints ? elements.hints.value : '';
        const hints = hintsText ? hintsText.split('\n').map(h => h.trim()).filter(h => h) : [];
        const points = elements.points ? parseInt(elements.points.value) : 10;

        if (!questionText.trim() || !correctAnswer.trim()) {
            this.showToast('Pertanyaan dan jawaban harus diisi!', 'error');
            return;
        }

        this.addQuestion(questionText, correctAnswer, description, hints, points);
        this.clearAddForm();
    }

    editQuestion(questionId) {
        console.log('Editing question:', questionId);
        const question = this.state.questions.find(q => q.id === questionId);
        if (!question) return;

        this.state.editingQuestionId = questionId;
        
        // Fill edit form
        const elements = {
            editQuestionId: document.getElementById('editQuestionId'),
            editQuestionText: document.getElementById('editQuestionText'),
            editCorrectAnswer: document.getElementById('editCorrectAnswer'),
            editQuestionDescription: document.getElementById('editQuestionDescription'),
            editQuestionHints: document.getElementById('editQuestionHints'),
            editQuestionPoints: document.getElementById('editQuestionPoints')
        };

        if (elements.editQuestionId) elements.editQuestionId.value = questionId;
        if (elements.editQuestionText) elements.editQuestionText.value = question.question;
        if (elements.editCorrectAnswer) elements.editCorrectAnswer.value = question.correctAnswer;
        if (elements.editQuestionDescription) elements.editQuestionDescription.value = question.description || '';
        if (elements.editQuestionHints) elements.editQuestionHints.value = question.hints ? question.hints.join('\n') : '';
        if (elements.editQuestionPoints) elements.editQuestionPoints.value = question.points || 10;

        this.showElement('editModal');
    }

    closeEditModal() {
        this.hideElement('editModal');
        this.state.editingQuestionId = null;
    }

    handleSaveEdit() {
        const elements = {
            questionId: document.getElementById('editQuestionId'),
            questionText: document.getElementById('editQuestionText'),
            correctAnswer: document.getElementById('editCorrectAnswer'),
            description: document.getElementById('editQuestionDescription'),
            hints: document.getElementById('editQuestionHints'),
            points: document.getElementById('editQuestionPoints')
        };

        if (!elements.questionId || !elements.questionText || !elements.correctAnswer) {
            this.showToast('Form elements not found', 'error');
            return;
        }

        const questionId = elements.questionId.value;
        const questionText = elements.questionText.value;
        const correctAnswer = elements.correctAnswer.value;
        const description = elements.description ? elements.description.value : '';
        const hintsText = elements.hints ? elements.hints.value : '';
        const hints = hintsText ? hintsText.split('\n').map(h => h.trim()).filter(h => h) : [];
        const points = elements.points ? parseInt(elements.points.value) : 10;

        if (!questionText.trim() || !correctAnswer.trim()) {
            this.showToast('Pertanyaan dan jawaban harus diisi!', 'error');
            return;
        }

        if (this.updateQuestion(questionId, questionText, correctAnswer, description, hints, points)) {
            this.closeEditModal();
        }
    }

    deleteQuestionConfirm(questionId) {
        console.log('Deleting question:', questionId);
        const question = this.state.questions.find(q => q.id === questionId);
        if (!question) return;

        this.state.deletingQuestionId = questionId;
        const deleteQuestionPreviewElement = document.getElementById('deleteQuestionPreview');
        if (deleteQuestionPreviewElement) {
            deleteQuestionPreviewElement.textContent = question.question;
        }
        this.showElement('deleteModal');
    }

    closeDeleteModal() {
        this.hideElement('deleteModal');
        this.state.deletingQuestionId = null;
    }

    handleConfirmDelete() {
        if (this.state.deletingQuestionId) {
            this.deleteQuestion(this.state.deletingQuestionId);
            this.closeDeleteModal();
        }
    }

    // =================== UTILITY FUNCTIONS ===================

    showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('hidden');
        }
    }

    hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hidden');
        }
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showToast(message, type = 'info', duration = 4000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.log(`Toast [${type}]:`, message);
            return;
        }
        
        const toastId = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 5);
        
        const icons = {
            success: '✅',
            error: '❌', 
            info: 'ℹ️',
            warning: '⚠️'
        };

        const toastHTML = `
            <div id="${toastId}" class="toast toast--${type}">
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${this.escapeHtml(message)}</span>
                <button class="toast-close" onclick="window.app.closeToast('${toastId}')">&times;</button>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        // Auto remove
        setTimeout(() => {
            this.closeToast(toastId);
        }, duration);

        console.log(`Toast [${type}]:`, message);
    }

    closeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.animation = 'slideInRight reverse var(--duration-normal) var(--ease-standard)';
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.remove();
                }
            }, 250);
        }
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app) {
        window.app.showToast('Terjadi kesalahan. Silakan muat ulang halaman.', 'error');
    }
});

// Enhanced browser compatibility check
function checkBrowserCompatibility() {
    const requirements = [
        { feature: 'localStorage', test: () => typeof Storage !== 'undefined' },
        { feature: 'Promise', test: () => typeof Promise !== 'undefined' },
        { feature: 'MediaDevices', test: () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia },
        { feature: 'Canvas', test: () => !!document.createElement('canvas').getContext },
        { feature: 'Blob', test: () => typeof Blob !== 'undefined' }
    ];

    const unsupported = requirements.filter(req => {
        try {
            return !req.test();
        } catch (e) {
            return true;
        }
    });
    
    if (unsupported.length > 0) {
        const missingFeatures = unsupported.map(req => req.feature).join(', ');
        alert(`Browser Anda tidak mendukung fitur berikut: ${missingFeatures}. Silakan gunakan browser modern seperti Chrome, Firefox, atau Safari versi terbaru.`);
        return false;
    }
    
    return true;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking browser compatibility...');
    
    // Check browser compatibility first
    if (!checkBrowserCompatibility()) {
        return;
    }
    
    // Initialize app with retry mechanism
    let initAttempts = 0;
    const maxAttempts = 10;
    
    function initializeApp() {
        initAttempts++;
        
        try {
            console.log(`App initialization attempt ${initAttempts}/${maxAttempts}`);
            
            if (typeof Html5QrcodeScanner !== 'undefined' || initAttempts >= maxAttempts) {
                console.log('Initializing QR Learning Advanced...');
                window.app = new QRLearningAdvanced();
                window.app.init().then(() => {
                    console.log('QR Learning Advanced initialized successfully');
                }).catch((error) => {
                    console.error('Error during app initialization:', error);
                });
            } else {
                console.log('Html5QrcodeScanner not yet available, retrying...');
                setTimeout(initializeApp, 200);
            }
        } catch (error) {
            console.error('Error initializing app:', error);
            if (initAttempts < maxAttempts) {
                setTimeout(initializeApp, 200);
            } else {
                alert('Error loading application. Please refresh the page.');
            }
        }
    }
    
    initializeApp();
});

// Enhanced debugging utility
window.debugQRApp = () => {
    if (window.app) {
        return {
            currentPage: window.app.state.currentPage,
            currentQuestion: window.app.state.currentQuestionIndex,
            sessionData: window.app.state.sessionData,
            isScanning: window.app.state.isScanning,
            isCameraOn: window.app.state.isCameraOn,
            availableCameras: window.app.state.availableCameras.length,
            selectedCamera: window.app.state.selectedCameraId,
            questionsCount: window.app.state.questions.length,
            statistics: window.app.state.statistics,
            historyCount: window.app.state.learningHistory.length
        };
    }
    return { status: 'App not initialized' };
};