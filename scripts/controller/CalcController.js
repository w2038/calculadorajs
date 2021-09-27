// controladores da calculadora
class CalcController {
    // metodo contrutor (aquilo que será executado automaticamente)
    constructor() {
        // o 'this' faz referencia aos métodos(funções) e atributos(variaveis)
        //  o this precedido de _ signigfica que é privado 

        // variaveis que virá propriedades 
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';

        // joga o valor no display da calculadora com os ID's
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");


        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        })

    }


    copyToClipboard() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();


    }

    // metodo (funcao) que inicia os dados no display
    initialize() {
        // metodo que retorna a data ou a hora
        this.setDisplayDateTime()


        // metodo de iniciacao (metodo  nativo do JS) para inicia uma execucao num determinado tempo
        setInterval(() => {

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });
        });

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;

            this._audio.play();

        }
    }

    initKeyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio();


            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key)
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });
    }

    // metodo para adicionar todos os eventos de diferentes cliques nos botões
    addEventListenerAll(element, events, fn) {

        // split metodo nativo que separa com como o que é mostrado entre parenteses
        // e retorna um array dá um forEach no evento
        events.split(' ').forEach(event => {
            // pega os elementos dos eventos (btn, "click drag", e =>)
            //addEventListener classe nativa no javascript para eventos de click
            element.addEventListener(event, fn, false);

        })

    }
    // Limpa tudo e deixa em um array vazio
    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }
    clearEntry() {
        
        // limpa o ultimo numero 
        this._operation.pop();

        this.setLastNumberToDisplay()

    }

    // pega a ultima item do array
    getLastOperation() {

        return this._operation[this._operation.length - 1];
    }


    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {
//se encontrar um dos operadores retorne true caso contrario retorne false
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }


    pushOperation(value) {

        this._operation.push(value);
//se tiver mais de tres operadores faça o calculo
        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult() {

        try {

            return eval(this._operation.join(""));

        } catch (e) {
            setTimeout(() => {

                this.setError();

            }, 1);

        }

    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }


        if (this._operation.length > 3) {

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        // atualiza a tela no final
        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem && lastItem !== 0) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }


    // adicionar um operador
    addOperation(value) {

//se for uma string
        if (isNaN(this.getLastOperation())) {

            // se for um operador
            if (this.isOperator(value)) {
                //troca o operador
                this.setLastOperation(value);


            } else {

                //

                this.pushOperation(value);
                //atualizar display
                this.setLastNumberToDisplay();
            }
// se for um numero
        } else {
//se for um operador
            if (this.isOperator(value)) {
                //adiciona no array
                this.pushOperation(value);

            } else {
//pegue o ultimo valor e tranforma em string e concatena com outro valor e faça o mesmo
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }
        }

    }

    setError() {

        this.displayCalc = "Error";

    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.' > -1)) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }
// classe para execução dos botoes
    execBtn(value) {

        //classe para execucao de audio
        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+')
                break;

            case 'subtracao':
                this.addOperation('-')
                break;

            case 'multiplicacao':
                this.addOperation('*')
                break;

            case 'divisao':
                this.addOperation('/')
                break;

            case 'porcento':
                this.addOperation('%')
                break;

            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }

    }

    // metodo para eventos dos buttoes
    initButtonsEvents() {

        // variavel que pega todos os butoes do DOM com os ID's "buttons"e "parts" com suas clases
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        // para cada botao(btn) faça os eventos dentro da função
        buttons.forEach((btn) => {

            // adiciona o evento clique em todos os botoes 

            this.addEventListenerAll(btn, "click drag", e => {

                // tras somente o nome da classe do botao (btn.className.baseVal(baseVal apenas para fgv)) e ainda substitua (replace)"btn-" por "" entao é trazido apenas o numero
                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);

            })
            //colocando eventos de mouse respectivamente 
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                //e muda o estilo do cursor para "pointer" mãozinha
                btn.style.cursor = "pointer";

            })

        })

    }

    // metodo que retorna a data ou a hora
    setDisplayDateTime() {

        // pega a data local com os paramentros descritos em seguida e joga no atributo displayDate
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        // pega a hora local com os paramentros descritos em seguida e joga no atributo displayTime
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }



    // ########################################################
    // metodos referente ao display (valores mostrados em tela) 
    // ########################################################

    // pegue a hora
    get displayTime() {

        return this._timeEl.innerHTML;

    }
    // coloque o valor da hora e retorna no valor
    set displayTime(value) {

        return this._timeEl.innerHTML = value;

    }
    // pegue a data
    get displayDate() {

        return this._dateEl.innerHTML;

    }
    // coloque a data e retorna o valor
    set displayDate(value) {

        return this._dateEl.innerHTML = value;

    }

    // pegue o valor do this._displayCalcEl = document.querySelector("#display").innerHTML;
    get displayCalc() {

        return this._displayCalcEl.innerHTML;

    }

    // mude o valor do displayCalc()
    set displayCalc(value) {

        if (value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;

    }
    // pegue a data atual
    get currentDate() {
        // retorna uma nova instancia
        return new Date();

    }
    // mude a data atual (converta)
    set currentDate(value) {

        this._currentDate = value;

    }

}