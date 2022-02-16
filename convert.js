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