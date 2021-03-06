/**
 * Long live Sparta! Vytvořte funkci, která vyřeší Caesarovu širfu. Funkce dostane 
 * na vstup zašifrovaný text a také hodnotu, která byla použita při šifrování, a pak 
 * vrátí dešifrovaný text. Předpokládejte pouze anglickou abecedu s velkými 
 * písmeny, ostatní znaky ignorujte. Poté v konzoli dešifrujte/dešiftujte následující texty.
 * 
 * key used - encrypted text
 *       19 - MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG
 *        5 - YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW
 *       12 - M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ
 * 
 * Následně vytvořte uživatelské rozhraní, ve kterém bude možné zadat zmíněné dvě 
 * vstupní hodnoty (zašifrovaný text a použitý klíč) a po kliknutí na tlačítko 
 * "Decipher!" se na určeném místě zobrazí dešifrovaný text. Rozhraní také vhodně
 * nastylujte.
 */
//              0123456789...
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
    // a helper function to shift one character inside the 
    // alphabet based on the shift value and return the result
    let i = alphabet.indexOf(c);
    if (i - shift < 0) {
        i = i + 26;
    }
    c = alphabet.charAt(i - shift);
    return c;
};

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

const shiftString = (str, shift) => {
    // a helper function to shift one entire string inside the 
    // alphabet based on the shift value and return the result
    let i;
    shiftedStr = '';
    for (i = 0; i < str.length; i++) {
        if (isInArray(str.charAt(i), alphabet.split(''))) {
            shiftedChar = shiftChar(str.charAt(i), shift);
        } else {
            shiftedChar = str.charAt(i);
        };
        shiftedStr = shiftedStr + shiftedChar;
    }
    return shiftedStr;
};

const caesarDecipher = (cipherText, usedKey) => {
    // your implementation goes here
    // good to know: 
    //    str.indexOf(c) - returns the index of the specified character in the string
    //    str.charAt(i) - returns the character at the specified index in the string
    //    when the shifted character is out of bound, it goes back to the beginning and count on from there
    deciphered = shiftString(cipherText.toUpperCase(), usedKey);
    return deciphered;
};

// albert einstein
console.log(caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19));

// john archibald wheeler
console.log(caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5));

// charles darwin
console.log(caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12));

const cipherTextArea = document.querySelector('#cipher-text-area');
const usedKeyInput = document.querySelector('#used-key-input');
const decipherButton = document.querySelector('#decipher-button');
const output = document.querySelector('#output');
const form = document.querySelector('#form');

decipherButton.addEventListener('click', (e) => {
    let cipherText = cipherTextArea.value;
    let usedKey = usedKeyInput.value;
    if (usedKeyInput.value > 26) {
        form.insertBefore(warning, decipherButton);
    } else {
        output.innerText = caesarDecipher(cipherText, usedKey);
    };

    e.preventDefault();
})