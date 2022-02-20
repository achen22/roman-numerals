"use strict";

var html_elements = {
  converted: null,
  text: null,
  classname: "hidden",
  set_visibility: function (show_converted, show_text) {
    if (this.converted === null) {
      this.converted = document.getElementById("converted");
    }
    if (this.text === null) {
      this.text = document.getElementById("text");
    }
    if (show_converted) {
      this.converted.classList.remove(this.classname);
    } else {
      this.converted.classList.add(this.classname);
    }
    if (show_text) {
      this.text.classList.remove(this.classname);
    } else {
      this.text.classList.add(this.classname);
    }
  }
};

function convert() {
  /** @type String */
  var number = document.getElementById("number").value;
  if (!number.length) {
    return invalid_input();
  } else if (/^\d+$/.test(number)) {
    // All characters are numbers
    number = parseInt(number);
    if (number == 0 || number > 10000) {
      return invalid_input();
    }
    html_elements.set_visibility(true, false);
    html_elements.converted.innerHTML = decimal_to_roman(number);
  } else if (/^[IVXLCDM]+$/.test(number)) {
    // All characters are roman numeral letters
    number = parse_roman(number)
    if (number <= 0) {
      return invalid_input();
    }
    html_elements.set_visibility(true, false);
    html_elements.converted.innerHTML = number.toString();
  } else {
    invalid_input();
  }
}

function invalid_input() {
  let errMsg = "Invalid input!";
  html_elements.set_visibility(false, true);
  document.getElementById("text").innerHTML = errMsg;
}

function decimal_to_roman(n) {
  let ones = n % 10;
  n = (n - ones) / 10;
  let tens = n % 10;
  n = (n - tens) / 10;
  let hundreds = n % 10;
  let thousands = (n - hundreds) / 10;
  let roman = "";
  for (let i = 0; i < thousands; i++) {
    roman += "M";
  }
  roman += roman_digit(hundreds, "C", "D", "M") // 100, 500, 1000
  roman += roman_digit(tens, "X", "L", "C") // 10, 50, 100
  roman += roman_digit(ones, "I", "V", "X") // 1, 5, 10
  return roman;
}

function roman_digit(n, one, five, ten) {
  if (n == 9) {
    return one + ten;
  }
  if (n == 4) {
    return one + five;
  }
  let roman = "";
  if (n >= 5) {
    roman = five;
    n -= 5;
  }
  for (let i = 0; i < n; i++) {
    roman += one;
  }
  return roman;
}

function parse_roman(roman) {
  let positive = 0;
  let negative = 0;
  let previous = 0;
  let count = 1;
  for (let i = 0; i < roman.length; i++) {
    let current = parse_roman_letter(roman[i]);
    if (current == previous) {
      count++;
    } else {
      if (current < previous) {
        positive += previous * count;
      } else {
        negative += previous * count;
      }
      previous = current;
      count = 1;
    }
  }
  return positive - negative + previous * count;
}

function parse_roman_letter(roman) {
  switch (roman) {
    case "I":
      return 1;
    case "V":
      return 5;
    case "X":
      return 10;
    case "L":
      return 50;
    case "C":
      return 100;
    case "D":
      return 500;
    case "M":
      return 1000;
    default:
      return NaN;
  }
}

// test
if (false) {
  for (let i = 1; i < 4000; i++) {
    let roman = decimal_to_roman(i);
    let decimal = parse_roman(roman);
    if (i != decimal) {
      console.log([i.toString(), roman, decimal.toString()].join(" -> "));
    }
  }  
}
