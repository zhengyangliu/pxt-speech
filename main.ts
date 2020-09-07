/**
* StormScience Speech recognition module package
* @author ArthurZheng
*/
//% weight=10 icon="\uf130" color=#2896ff
namespace speech {
    
    /**
     * Set speech module pins, should run at first.
     * @param {SerialPin} t - transmit pin of uart, eg: SerialPin.P1
     * @param {SerialPin} r - recive pin of uart, eg: SerialPin.P2
     */
    //% blockId=speechSetPin block="set speech module pins T %t R %r"
    //% t.defl=SerialPin.P1
    //% r.defl=SerialPin.P2
    //% weight=100
    export function setPin(t: SerialPin, r: SerialPin): void {
        // swap tx pin and rx pin
        serial.redirect(r, t, BaudRate.BaudRate115200)
        serial.setRxBufferSize(28)
    }

    /**
     * Say words.
     * @param {string} str - Hex code of words with space betwin, eg: C4 E3 BA C3 
     * @note Because makecode transformation chinese characters as UTF-8, but the TTS
     *       function using GBK code, so we can only use data that has been transcoded.
     */
    //% blockId=speechSay block="say %str"
    //% str.defl="C4 E3 BA C3"
    //% weight=99
    export function say(str : string): void {
        let head = "<G>"
        let arr = str.split(" ")
        let len = arr.length

        let bufr = pins.createBuffer(3 + len)

        
        bufr.setNumber(NumberFormat.UInt8LE, 0, head.charCodeAt(0));
        bufr.setNumber(NumberFormat.UInt8LE, 1, head.charCodeAt(1));
        bufr.setNumber(NumberFormat.UInt8LE, 2, head.charCodeAt(2));

        for(let i = 0; i < len; i++){
            bufr.setNumber(NumberFormat.UInt8LE, 3 + i, parseInt('0x' + arr[i]))
        }

        serial.writeBuffer(bufr)
    }

    /**
     * Recognize voice.
     * @return {number}  the index of speech list
     */
    //% blockId=speechHear block="recognize voice"
    export function hear(): number{
        let rx = serial.readBuffer(27)
        return (rx.getNumber(NumberFormat.Int8LE, 12))
    }
}

