class Converter  {
    constructor() {
        this.url = 'http://api.exchangeratesapi.io/v1/latest?';
        this.apiKey = '8a401c8e0e05334c32dbec5930a63d9d';
        this.saleSelected = document.querySelector('.sale_selected');
        this.buySelected = document.querySelector('.buy_selected')
        this.valueCurrensyToSale = document.querySelector('[name="sale"]');
        this.valueCurrensyToBuy = document.querySelector('[name="buy"]');
        this.saleInfo = document.querySelector('.sale-info');
        this.buyInfo = document.querySelector('.buy-info');
    }

    setEventListenersForButtons() {
        let currencToSale = document.querySelectorAll('.sale-button')
        let currencToBuy = document.querySelectorAll('.buy-button')
        currencToSale.forEach((element) => {
            element.addEventListener('click', (event) => {
                this.saleSelected.classList.remove('sale_selected');
                this.saleSelected = event.target;
                this.saleSelected.classList.add('sale_selected');
                this.getCurrencyNames() 
                this.getDataFromHost()
            })
        });
        currencToBuy.forEach((element) => {
            element.addEventListener('click', (event) => {
                this.buySelected.classList.remove('buy_selected');
                this.buySelected = event.target;
                this.buySelected.classList.add('buy_selected');
                this.getCurrencyNames() 
                this.getDataFromHost()
                })  
        });
    }

    setEventListenersForInputs() {
        // 1. Ищем инпуты 
        this.valueCurrensyToSale = document.querySelector('[name="sale"]');
        this.valueCurrensyToBuy = document.querySelector('[name="buy"]');
        // 2. Добавляем на них обработчики события 'input'
        this.valueCurrensyToSale.addEventListener('input', () => {
            this.valueCurrensyToSale.value
            this.getDataFromHost();
            this.leftIputSale = true;
        })

        this.valueCurrensyToBuy.addEventListener('input', () => {
            this.valueCurrensyToBuy.value
            this.getDataFromHost();
            this.leftIputSale = false;
        })
        // 3. При срабатывании создаем запрос на сервер, получаем ответ и рендерим информацию
        
    }

    // Получаем данные о текущих выбраных валютах
    getCurrencyNames () {
        this.base = this.saleSelected.getAttribute('data-currency');
        this.symbol = this.buySelected.getAttribute('data-currency');
    }

    //  Получить ответ и вернуть его
    getDataFromHost () {
        
        fetch(this.url+`access_key=${this.apiKey}&base=${this.base}&symbols=${this.symbol}`)
            .then(response => response.json())
            .then( data => {
                this.toSale = data.rates[this.symbol]; 
                this.toBuy = 1 / this.toSale
                console.log((this.toSale).toFixed(4))
                console.log((this.toBuy).toFixed(4))
                this.render();
            })
            .catch(error => {
                let messageError = document.querySelector('.message-Error')
                messageError.textContent = 'Что-то пошло не так';
                console.log(error)
            }) 
    }
    
    // Вывод информации курса на страницу
    renderRatesInfo () {
        this.saleInfo.textContent = `1 ${this.saleSelected.textContent} = ${this.toSale.toFixed(4)} ${this.buySelected.textContent}`;
        this.buyInfo.textContent = `1 ${this.buySelected.textContent} = ${this.toBuy.toFixed(4)} ${this.saleSelected.textContent}`;
        
    }

    // Вывод информации на экран
    render () {
        this.renderRatesInfo();
        let leftinput = document.querySelector('#leftinput')
        let rightinput = document.querySelector('#rightinput')
        if (this.leftIputSale) {
            rightinput.value = (parseFloat(leftinput.value) * this.toSale).toFixed(2)
        } else  {
            leftinput.value =(parseFloat(rightinput.value) / this.toSale).toFixed(2)
        }

    }

    // Метод выводит информацию на экран 
    init () {
        this.setEventListenersForButtons();
        this.getCurrencyNames();
        this.getDataFromHost();
        this.setEventListenersForInputs()
    }
}

let converter = new Converter();
converter.init();