export class NumberFactory {

  /*
  This library intends to expose some useful properties of numbers
  It intends to process the given number as a string as much as possible to avoid
  running into floating point restrictions
  */

  #lang;
  #ones_index = 0  ; // all the single letter words start at index 0 to index 20
  #tens_index = 20 ; // 2 letter number prefixes start here
  #huns_index = 28 ; // the word hundred, kind of an odd man out
  #mils_index = 29 ; // all the powers of 1000 start here keep adding to your hearts delight
  #conjunction     = 'and'      ;
  #negative_prefix = 'negative' ;
  #decimal_prefix  = 'dot';

  constructor(number_string) {
    this.inputString = number_string;

  }

  get lang() {
    // get the lang if set, if not the system default
    if ( typeof this.#lang === 'undefined' ) {
      return (navigator.languages != undefined) ? 
      navigator.languages[0] : 
      navigator.language ;
    } else {
      return this.#lang;
    }
  }

  set lang(lang) {
    // set lang, dont set, if bad input is provided
    try {
      const result = Intl.NumberFormat(lang);
    } catch (e) {
      return;
    }
    this.#lang = lang;
  }

  get decimalPrefix() {
    return this.#decimal_prefix;
  }

  set decimalPrefix(decimal_prefix) {
    this.#decimal_prefix = decimal_prefix;
  }

  get negativePrefix() {
    return this.#negative_prefix;
  }

  set negativePrefix(negative_prefix) {
    this.#negative_prefix = negative_prefix;
  }

  get conjunction() {
    return this.#conjunction;
  }

  set conjunction(conjunction) {
    this.#conjunction = conjunction;
  }

  get seperator () {
    // Depending on the lang of the user, the seperators used for numbers
    const numberWithGroupAndDecimalSeparator = 1000.1;
    const result = Intl.NumberFormat(this.lang)
      .formatToParts(numberWithGroupAndDecimalSeparator);
    return { 
      decimal: result.find(part => part.type === 'decimal').value,
      group: result.find(part => part.type === 'group').value
    };
  }

  get isNegative() {
    return /^[-:space:]+/.test(this.inputString);
  }

  get rawString() {
    // The input string cleaned up removing any group seperators like commas in en-US
    const re = new RegExp( '\\' + this.seperator.group, 'g' ); 
    return this.inputString.replace(/^[-:space:]+/,'').replace(re,'');
  }

  get integerString() {
    // The part of the cleaned up input to the right of the decimal point
    return this.rawString.split(this.seperator.decimal)[0].replace(/^[0:space:]*/,'');
  }

  get decimalString() {
    // The part of the cleaned up input to the right of the decimal point
    const arr = this.rawString.split(this.seperator.decimal);
    if (arr.length > 1) {
      return arr[1].replace(/[0:space:]*$/,'');
    }
    return '';
  }

  get integerPrecision() {
    return this.integerString.length;
  }

  get scale() {
    return this.decimalString.length;
  }

  get precision() {
    return this.integerString.length + this.decimalString.length;
  }

  get wordList() {
    return [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
      "hundred",
      "thousand",
      "million",
      "billion",
      "trillion",
      "quadrillion",
      "quintillion",
      "sextillion",
      "septillion",
      "octillion",
      "nonillion",
      "decillion",
      "undecillion",
      "duodecillion",
      "tredecillion"
    ];
  }

  get decimalWords () {
    let i  = this.decimalString;
    if (parseFloat(i) != 0) {
      let o = '';
      for ( let x = 0; x < i.length; x++ ) {
        o = [ o, this.wordList[this.#ones_index + parseInt(i.charAt(x))] ].join(' ');
      }
      return o.trim();
    } else {
      return '';
    }
  }

  get integerWords() {

    let i = this.integerString;

    // function ones
    // Expects any 1 or 2 digit number from 0 to 20 and converts it to a word.
    // Be careful! It does not check the validity of input if you give it any
    // thing apart from a 1 or 2 digit number from 0 to 20, results will be useless.
    // check the inputs before calling it
    const ones = (number) => {
      return this.wordList[this.#ones_index + parseInt(number)];
    }

    // function tens
    // Expects any 2 digit number from 20 to 99 and converts it to words.
    // Be careful! It does not check the validity of input if you give it any
    // thing apart from a 2 digit number from 20 to 99, results will be useless.
    // check the inputs before calling it
    const tens = (number) => {
        const number_string = number.toString();
        const tens_digit = parseInt(number_string.substring(0, 1));
        const unit_digit = parseInt(number_string.substring(1));
        const result = this.wordList[this.#tens_index + tens_digit - 2];
        if (unit_digit > 0 ) { 
            return [result, ones(unit_digit)].join(' '); 
        }
        return result;
    }
    
    // function hundreds
    // Expects any 3 digit number from 100 to 999 and converts it to words.
    // Be careful! It does not check the validity of input if you give it any
    // thing apart from a 3 digit number from 100 to 999, results will be useless.
    // check the inputs before calling it
    const hundreds = (number) => {
      const number_string = number.toString();
      const hundreds_digit = parseInt(number_string.substring(0, 1));
      const tens_remainder = parseInt(number_string.substring(1));
      const result = [ ones(hundreds_digit), this.wordList[this.#huns_index] ].join(' ');
      if (tens_remainder > 0 ) {
          if (tens_remainder < 21) {
              return [ result, this.#conjunction, ones(tens_remainder)].join(' ');
          } else {
              return [ result, this.#conjunction, tens(tens_remainder)].join(' ');
          }
      }
      return result;
    }

    const underThousand = (number) => {
      const number_string = number.toString();

      // If the decimal part of the number input is 1 or 2 digits long and is from 0 to 19
      // then run the ones function on it.
      if (/^0*[0-1]?[0-9]$/.test(number_string)) {
        return ones(parseInt(number_string));
      }

      // If the code gets here, the decimal portion of the number is more than 19
      // If the decimal part of the number input is a 2 digit number from 20 to 99, 
      // then run the tens function on it.
      if (/^0*[2-9][0-9]$/.test(number_string)) {
        return tens(parseInt(number_string));
      }

      // If the code gets here, the decimal portion of the number is more than 99
      // If the decimal part of the number input is a 3 digit number from 100 to 999, 
      // then run the hundreds function on it
      if (/^0*[0-9][0-9][0-9]$/.test(number_string)) {
        return hundreds(parseInt(number_string));
      }

    }
    
    // function thousands
    // Expects any number over 3 digits long and converts it to words.
    // Be careful! It does not check the validity of input if you give it any
    // thing apart from a number longer than 3 digits, results will be useless.
    // check the inputs before calling it
    const overThousand = (number) => {
      const number_string    = number.toString();
      let   number_array     = number_string.replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(',');
      const thousands_index  = number_array.length - 2;
      const left_string      = number_array[0];
      number_array.shift();
      const right_string     = number_array.join('');
      if ( thousands_index   > this.wordList.length - this.#mils_index ) {
        const words_string   = this.wordList.toString().replace(/\w+/g,'"'+"$&"+'"').replace(/,/g, ", ");
        return "You are degenerate, why would you want to spell out a number this large.\n" +
            "If you insist on giving yourself a headache, go look for this line of code " +
            "and add other crazy words to the end.\n\n" +
            "const words = ["+words_string+"]";
      }
      const mils_name = this.wordList[this.#mils_index + thousands_index ];
      const result    = parseInt(left_string) > 0 ? [ underThousand(left_string), mils_name ].join(' ') : '';
      if (parseFloat(right_string) > 999) {
        return [ result, overThousand(right_string) ].join(', ');
      }
      if (parseInt(right_string) > 99) {
        return [ result, underThousand(right_string) ].join(', ');
      }
      if (parseInt(right_string) > 0) {
        return [ result, this.#conjunction, underThousand(right_string) ].join(' ');
      }
      return result;
    }

    if (i.toString().length < 4) {
      return underThousand(i);
    } else {
      console.log (i);
      return overThousand(i);
    }

  }

  get words() {
    let result = '';
    if (this.isNegative) {
      result = [result, this.#negative_prefix].join(' ').trim();
    }
    if (this.integerWords) {
      result = [result, this.integerWords].join(' ').trim();
    }
    if (this.decimalString) {
      return [result, this.#decimal_prefix, this.decimalWords ].join(' ').trim();
    } 
    return result;
  }

  get formatedNumber() {
    const integerResult = this.integerString.replace(/\B(?=(\d{3})+(?!\d))/g, this.seperator.group);
    if (parseFloat(this.decimalString) > 0) {
      return integerResult + this.seperator.decimal + this.decimalString;
    }
    return integerResult;
  }

  get scientificNotation() {
    const coefficient  = Math.round((parseFloat(this.integerString.substring(0,4).replace(/./, "$&.")) + Number.EPSILON) * 100) / 100;
    const exponent     = this.integerPrecision - 1;
    return coefficient.toString() + ' × 10<sup>' + exponent + '</sup>';
  }

}





// let tool00 = new NumberFactory('1,44.42.09');
// let tool01 = new NumberFactory('42.09');
// let tool06 = new NumberFactory('642.09');
// let tool07 = new NumberFactory('642.09');
// let tool02 = new NumberFactory('56654646886642.09000');
let tool02 = new NumberFactory('676,38.353');



