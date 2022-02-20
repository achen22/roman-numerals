"use strict";

var html_elements = {
  converted: null,
  text: null,
  classname: "hidden",
  set_visibility: function (show_converted) {
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
  }
};

function convert() {
  /** @type String */
  let number = document.getElementById("number").value;
  if (!number.length) {
    return invalid_input();
  } else if (/^\d+$/.test(number)) {
    // All characters are numbers
    number = parseInt(number);
    if (number == 0 || number > 10000) {
      return invalid_input();
    }
    html_elements.set_visibility(true);
    html_elements.converted.innerHTML = decimal_to_roman(number);
    html_elements.text.innerHTML = number_to_text(number);
  } else if (/^[IVXLCDM]+$/.test(number)) {
    // All characters are roman numeral letters
    number = parse_roman(number)
    if (number <= 0) {
      return invalid_input();
    }
    html_elements.set_visibility(true);
    html_elements.converted.innerHTML = number.toString();
    html_elements.text.innerHTML = number_to_text(number);
  } else {
    invalid_input();
  }
}

function invalid_input() {
  let errMsg = "Invalid input!";
  html_elements.set_visibility(false);
  html_elements.text.innerHTML = errMsg;
}

function decimal_to_roman(n) {
  const ones = n % 10;
  n = (n - ones) / 10;
  const tens = n % 10;
  n = (n - tens) / 10;
  const hundreds = n % 10;
  const thousands = (n - hundreds) / 10;
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
    const current = parse_roman_letter(roman[i]);
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

function number_to_text(n) {
  if (n < 1000) {
    return number_to_text_under_thousand(n);
  }
  const remainder = n % 1000;
  const thousands = (n - remainder) / 1000;
  let text = number_to_text(thousands) + " thousand";
  if (remainder >= 100) {
    text += " " + number_to_text_under_thousand(remainder);
  } else if (remainder) {
    text += " and " + number_to_text_under_hundred(remainder);
  }
  return text;
}

function number_to_text_under_thousand(n) {
  if (n < 100) {
    return number_to_text_under_hundred(n);
  }
  const remainder = n % 100;
  const hundreds = (n - remainder) / 100;
  let text = number_to_text_under_twenty(hundreds) + " hundred";
  if (remainder) {
    text += " and " + number_to_text_under_hundred(remainder)
  };
  return text;
}

function number_to_text_under_hundred(n) {
  if (n < 20) {
    return number_to_text_under_twenty(n);
  }
  const words = [
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety"
  ];
  const ones = n % 10;
  const tens = (n - ones) / 10;
  let text = words[tens - 2];
  if (ones) {
    text += " " + number_to_text_under_twenty(ones)
  }
  return text;
}

function number_to_text_under_twenty(n) {
  const words = [
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
    "nineteen"
  ];
  return words[n];
}

// test
if (false) {
  for (let i = 1; i < 4000; i++) {
    const roman = decimal_to_roman(i);
    const decimal = parse_roman(roman);
    if (i != decimal) {
      console.log([i.toString(), roman, decimal.toString()].join(" -> "));
    }
  }  
}
