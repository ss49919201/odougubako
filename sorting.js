class SortingVisualizer {
    constructor() {
        this.array = [];
        this.arraySize = 30;
        this.animationSpeed = 50;
        this.isAnimating = false;
        this.isPaused = false;
        this.timeoutId = null;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        
        this.algorithmInfo = {
            bubble: {
                title: 'バブルソート',
                description: '隣接する要素を比較し、順序が逆であれば交換を繰り返すソートアルゴリズムです。',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            selection: {
                title: '選択ソート',
                description: '未ソート部分から最小値を見つけて、ソート済み部分の末尾に配置するアルゴリズムです。',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            insertion: {
                title: '挿入ソート',
                description: '要素を一つずつソート済み部分の適切な位置に挿入していくアルゴリズムです。',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            quick: {
                title: 'クイックソート',
                description: 'ピボット要素を基準に配列を分割し、再帰的にソートする高速なアルゴリズムです。',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)'
            },
            merge: {
                title: 'マージソート',
                description: '配列を分割して個別にソートし、マージしながら統合する安定ソートアルゴリズムです。',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)'
            }
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();
        this.updateAlgorithmInfo();
    }
    
    initializeElements() {
        this.arrayContainer = document.getElementById('arrayContainer');
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.arraySizeSlider = document.getElementById('arraySizeSlider');
        this.arraySizeValue = document.getElementById('arraySizeValue');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.sortBtn = document.getElementById('sortBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.elapsedTimeEl = document.getElementById('elapsedTime');
        this.statusEl = document.getElementById('status');
        this.algoTitle = document.getElementById('algoTitle');
        this.algoDescription = document.getElementById('algoDescription');
        this.timeComplexity = document.getElementById('timeComplexity');
        this.spaceComplexity = document.getElementById('spaceComplexity');
    }
    
    setupEventListeners() {
        this.algorithmSelect.addEventListener('change', () => this.updateAlgorithmInfo());
        
        this.arraySizeSlider.addEventListener('input', (e) => {
            this.arraySize = parseInt(e.target.value);
            this.arraySizeValue.textContent = this.arraySize;
            if (!this.isAnimating) {
                this.generateArray();
            }
        });
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedValue.textContent = this.animationSpeed;
        });
        
        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.sortBtn.addEventListener('click', () => this.startSort());
        this.pauseBtn.addEventListener('click', () => this.pauseResume());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    generateArray() {
        this.array = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.array.push(Math.floor(Math.random() * 300) + 10);
        }
        this.renderArray();
        this.resetStatistics();
    }
    
    renderArray() {
        this.arrayContainer.innerHTML = '';
        const containerWidth = this.arrayContainer.offsetWidth || 800;
        const barWidth = Math.max(2, (containerWidth - this.arraySize * 2) / this.arraySize);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.left = `${index * (barWidth + 2)}px`;
            bar.dataset.index = index;
            this.arrayContainer.appendChild(bar);
        });
    }
    
    updateAlgorithmInfo() {
        const algorithm = this.algorithmSelect.value;
        const info = this.algorithmInfo[algorithm];
        
        this.algoTitle.textContent = info.title;
        this.algoDescription.textContent = info.description;
        this.timeComplexity.textContent = info.timeComplexity;
        this.spaceComplexity.textContent = info.spaceComplexity;
    }
    
    resetStatistics() {
        this.comparisons = 0;
        this.swaps = 0;
        this.comparisonsEl.textContent = '0';
        this.swapsEl.textContent = '0';
        this.elapsedTimeEl.textContent = '0ms';
        this.statusEl.textContent = '準備完了';
        this.statusEl.className = 'status-ready';
    }
    
    updateStatistics() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
        if (this.startTime) {
            const elapsed = Date.now() - this.startTime;
            this.elapsedTimeEl.textContent = `${elapsed}ms`;
        }
    }
    
    setStatus(status, className) {
        this.statusEl.textContent = status;
        this.statusEl.className = className;
    }
    
    highlightBars(indices, className = 'comparing') {
        this.clearHighlights();
        indices.forEach(index => {
            if (index >= 0 && index < this.array.length) {
                const bar = this.arrayContainer.children[index];
                if (bar) {
                    bar.classList.add(className);
                }
            }
        });
    }
    
    clearHighlights() {
        Array.from(this.arrayContainer.children).forEach(bar => {
            bar.classList.remove('comparing', 'swapping', 'sorted', 'pivot');
        });
    }
    
    async delay(ms = this.animationSpeed) {
        return new Promise(resolve => {
            this.timeoutId = setTimeout(resolve, ms);
        });
    }
    
    async startSort() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.setStatus('ソート中...', 'status-sorting');
        
        this.sortBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.generateBtn.disabled = true;
        
        const algorithm = this.algorithmSelect.value;
        
        try {
            switch (algorithm) {
                case 'bubble':
                    await this.bubbleSort();
                    break;
                case 'selection':
                    await this.selectionSort();
                    break;
                case 'insertion':
                    await this.insertionSort();
                    break;
                case 'quick':
                    await this.quickSort(0, this.array.length - 1);
                    break;
                case 'merge':
                    await this.mergeSort(0, this.array.length - 1);
                    break;
            }
            
            if (!this.isPaused) {
                this.setStatus('ソート完了', 'status-completed');
                this.showSortedAnimation();
            }
        } catch (error) {
            console.error('Sorting error:', error);
        }
        
        this.isAnimating = false;
        this.sortBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.generateBtn.disabled = false;
    }
    
    async showSortedAnimation() {
        for (let i = 0; i < this.array.length; i++) {
            if (!this.isAnimating) break;
            this.highlightBars([i], 'sorted');
            await this.delay(20);
        }
    }
    
    pauseResume() {
        if (!this.isAnimating) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.pauseBtn.textContent = '再開';
            this.setStatus('一時停止中', 'status-paused');
        } else {
            this.pauseBtn.textContent = '一時停止';
            this.setStatus('ソート中...', 'status-sorting');
        }
    }
    
    reset() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        this.isAnimating = false;
        this.isPaused = false;
        this.sortBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '一時停止';
        this.generateBtn.disabled = false;
        
        this.clearHighlights();
        this.resetStatistics();
        this.generateArray();
    }
    
    async bubbleSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (!this.isAnimating) break;
            
            for (let j = 0; j < n - i - 1; j++) {
                if (!this.isAnimating) break;
                
                while (this.isPaused) {
                    await this.delay(100);
                }
                
                this.comparisons++;
                this.highlightBars([j, j + 1], 'comparing');
                await this.delay();
                
                if (this.array[j] > this.array[j + 1]) {
                    this.swaps++;
                    this.highlightBars([j, j + 1], 'swapping');
                    
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    
                    const bar1 = this.arrayContainer.children[j];
                    const bar2 = this.arrayContainer.children[j + 1];
                    bar1.style.height = `${this.array[j]}px`;
                    bar2.style.height = `${this.array[j + 1]}px`;
                    
                    await this.delay();
                }
                
                this.updateStatistics();
            }
        }
    }
    
    async selectionSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (!this.isAnimating) break;
            
            let minIdx = i;
            this.highlightBars([i], 'sorted');
            
            for (let j = i + 1; j < n; j++) {
                if (!this.isAnimating) break;
                
                while (this.isPaused) {
                    await this.delay(100);
                }
                
                this.comparisons++;
                this.highlightBars([minIdx, j], 'comparing');
                await this.delay();
                
                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
                
                this.updateStatistics();
            }
            
            if (minIdx !== i) {
                this.swaps++;
                this.highlightBars([i, minIdx], 'swapping');
                
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                
                const bar1 = this.arrayContainer.children[i];
                const bar2 = this.arrayContainer.children[minIdx];
                bar1.style.height = `${this.array[i]}px`;
                bar2.style.height = `${this.array[minIdx]}px`;
                
                await this.delay();
            }
        }
    }
    
    async insertionSort() {
        const n = this.array.length;
        
        for (let i = 1; i < n; i++) {
            if (!this.isAnimating) break;
            
            const key = this.array[i];
            let j = i - 1;
            
            this.highlightBars([i], 'comparing');
            await this.delay();
            
            while (j >= 0 && this.array[j] > key) {
                if (!this.isAnimating) break;
                
                while (this.isPaused) {
                    await this.delay(100);
                }
                
                this.comparisons++;
                this.swaps++;
                
                this.highlightBars([j, j + 1], 'swapping');
                
                this.array[j + 1] = this.array[j];
                const bar = this.arrayContainer.children[j + 1];
                bar.style.height = `${this.array[j + 1]}px`;
                
                await this.delay();
                j--;
                this.updateStatistics();
            }
            
            this.array[j + 1] = key;
            const bar = this.arrayContainer.children[j + 1];
            bar.style.height = `${key}px`;
        }
    }
    
    async quickSort(low, high) {
        if (low < high && this.isAnimating) {
            const pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }
    
    async partition(low, high) {
        const pivot = this.array[high];
        this.highlightBars([high], 'pivot');
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (!this.isAnimating) break;
            
            while (this.isPaused) {
                await this.delay(100);
            }
            
            this.comparisons++;
            this.highlightBars([j, high], 'comparing');
            await this.delay();
            
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    this.swaps++;
                    this.highlightBars([i, j], 'swapping');
                    
                    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                    
                    const bar1 = this.arrayContainer.children[i];
                    const bar2 = this.arrayContainer.children[j];
                    bar1.style.height = `${this.array[i]}px`;
                    bar2.style.height = `${this.array[j]}px`;
                    
                    await this.delay();
                }
            }
            
            this.updateStatistics();
        }
        
        this.swaps++;
        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        
        const bar1 = this.arrayContainer.children[i + 1];
        const bar2 = this.arrayContainer.children[high];
        bar1.style.height = `${this.array[i + 1]}px`;
        bar2.style.height = `${this.array[high]}px`;
        
        this.highlightBars([i + 1, high], 'swapping');
        await this.delay();
        
        return i + 1;
    }
    
    async mergeSort(left, right) {
        if (left < right && this.isAnimating) {
            const mid = Math.floor((left + right) / 2);
            await this.mergeSort(left, mid);
            await this.mergeSort(mid + 1, right);
            await this.merge(left, mid, right);
        }
    }
    
    async merge(left, mid, right) {
        const leftArray = this.array.slice(left, mid + 1);
        const rightArray = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArray.length && j < rightArray.length) {
            if (!this.isAnimating) break;
            
            while (this.isPaused) {
                await this.delay(100);
            }
            
            this.comparisons++;
            this.highlightBars([k], 'comparing');
            await this.delay();
            
            if (leftArray[i] <= rightArray[j]) {
                this.array[k] = leftArray[i];
                i++;
            } else {
                this.array[k] = rightArray[j];
                j++;
            }
            
            const bar = this.arrayContainer.children[k];
            bar.style.height = `${this.array[k]}px`;
            this.highlightBars([k], 'swapping');
            
            k++;
            this.swaps++;
            this.updateStatistics();
            await this.delay();
        }
        
        while (i < leftArray.length) {
            if (!this.isAnimating) break;
            this.array[k] = leftArray[i];
            const bar = this.arrayContainer.children[k];
            bar.style.height = `${this.array[k]}px`;
            i++;
            k++;
            this.swaps++;
        }
        
        while (j < rightArray.length) {
            if (!this.isAnimating) break;
            this.array[k] = rightArray[j];
            const bar = this.arrayContainer.children[k];
            bar.style.height = `${this.array[k]}px`;
            j++;
            k++;
            this.swaps++;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});