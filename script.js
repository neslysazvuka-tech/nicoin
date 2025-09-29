class Nicoin {
    constructor() {
        this.price = 1.00;
        this.marketCap = 1000000;
        this.volume = 50000;
        this.totalSupply = 1000000;
        this.circulatingSupply = 500000;
        this.dailyGrowthRate = 0.02; // 2% ежедневный рост
        this.sellPressure = 0.01; // 1% снижение при продаже
        this.lastUpdate = Date.now();
        this.growthInterval = null;
        
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.startDailyGrowth();
        this.updateDisplay();
        this.setupEventListeners();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('nicoinData');
        if (saved) {
            const data = JSON.parse(saved);
            this.price = data.price || 1.00;
            this.marketCap = data.marketCap || 1000000;
            this.lastUpdate = data.lastUpdate || Date.now();
        }
    }
    
    saveToStorage() {
        const data = {
            price: this.price,
            marketCap: this.marketCap,
            lastUpdate: this.lastUpdate
        };
        localStorage.setItem('nicoinData', JSON.stringify(data));
    }
    
    startDailyGrowth() {
        // Обновляем цену каждую минуту для демонстрации
        this.growthInterval = setInterval(() => {
            this.applyDailyGrowth();
        }, 60000); // Каждую минуту вместо дня для демо
    }
    
    applyDailyGrowth() {
        const now = Date.now();
        const hoursPassed = (now - this.lastUpdate) / (1000 * 60 * 60);
        
        if (hoursPassed >= 24) {
            this.price *= (1 + this.dailyGrowthRate);
            this.updateMarketData();
            this.lastUpdate = now;
            this.saveToStorage();
            this.updateDisplay();
        }
    }
    
    buyNicoin(amount) {
        const cost = amount * this.price;
        this.volume += cost;
        this.updateMarketData();
        this.updateDisplay();
        this.showNotification(`Успешно куплено ${amount} Nicoin за $${cost.toFixed(2)}`);
        this.saveToStorage();
    }
    
    sellNicoin(amount) {
        const revenue = amount * this.price * (1 - this.sellPressure);
        this.volume += revenue;
        // Небольшое снижение цены при продаже
        this.price *= (1 - this.sellPressure * (amount / this.circulatingSupply));
        this.updateMarketData();
        this.updateDisplay();
        this.showNotification(`Успешно продано ${amount} Nicoin за $${revenue.toFixed(2)}`);
        this.saveToStorage();
    }
    
    updateMarketData() {
        this.marketCap = this.price * this.totalSupply;
    }
    
    updateDisplay() {
        const priceElement = document.getElementById('current-price');
        const changeElement = document.getElementById('price-change');
        const marketCapElement = document.getElementById('market-cap');
        const volumeElement = document.getElementById('volume');
        const supplyElement = document.getElementById('total-supply');
        
        if (priceElement) {
            priceElement.textContent = `$${this.price.toFixed(2)}`;
        }
        
        if (changeElement) {
            const change = ((this.price - 1.00) / 1.00 * 100).toFixed(2);
            changeElement.textContent = `${change >= 0 ? '+' : ''}${change}%`;
            changeElement.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
        
        if (marketCapElement) {
            marketCapElement.textContent = `$${this.formatNumber(this.marketCap)}`;
        }
        
        if (volumeElement) {
            volumeElement.textContent = `$${this.formatNumber(this.volume)}`;
        }
        
        if (supplyElement) {
            supplyElement.textContent = this.formatNumber(this.totalSupply);
        }
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return num.toFixed(2);
    }
    
    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    setupEventListeners() {
        // Обработчики для страницы торговли
        const buyForm = document.getElementById('buy-form');
        const sellForm = document.getElementById('sell-form');
        
        if (buyForm) {
            buyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = parseFloat(document.getElementById('buy-amount').value);
                if (amount > 0) {
                    this.buyNicoin(amount);
                }
            });
        }
        
        if (sellForm) {
            sellForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const amount = parseFloat(document.getElementById('sell-amount').value);
                if (amount > 0) {
                    this.sellNicoin(amount);
                }
            });
        }
    }
}

// Инициализация Nicoin когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.nicoin = new Nicoin();
});

// Стили для анимации уведомления
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
