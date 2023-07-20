const bill = document.querySelector("#bill");
let tipOptions = [...document.querySelector(".tip-options").children];
const tipBtns = document.querySelectorAll(".tip-btn");
const customTip = document.querySelector("#custom");
const numOfPeople = document.querySelector("#people");
const totalAmounts = document.querySelectorAll(".total-amounts");
const reset = document.querySelector(".reset");
let currentActiveTipOption;

const deactivateTipOption = () => {
  // remove "active" from tip options
  tipOptions.forEach((tipOption) => {
    tipOption.classList.remove("active");
  });
};

function handleFieldValues() {
  // only set "active" state on the tip options. Prevents setting "active" on bill or number of people when they are the current "this" value
  if (tipOptions.includes(this)) {
    // remove active class from tip option
    deactivateTipOption();

    // add active class to current tip button
    this.classList.add("active");
    currentActiveTipOption = this;
  }

  // if a tip option is not selected return so that a value is not calculated
  if (!currentActiveTipOption) {
    return;
  }

  let percent = currentActiveTipOption.classList.contains("custom")
    ? parseFloat(currentActiveTipOption.value) / 100
    : parseFloat(currentActiveTipOption.dataset.percent) / 100;

  let billPrice = parseFloat(bill.value);
  let amountOfPeople = parseFloat(numOfPeople.value);

  checkForZeroError();

  calculateTotals(percent, billPrice, amountOfPeople);
}

function calculateTotals(tax, billPrice, amountOfPeople) {
  let totalAmount = billPrice + billPrice * tax;
  let totalTip = (billPrice * tax) / amountOfPeople;
  let totalPerPerson = totalAmount / amountOfPeople;

  // remove NaN and Infinity from displaying
  if (Number.isNaN(totalTip) || !Number.isFinite(totalTip) || totalTip < 0) {
    totalAmounts[0].textContent = "$0.00";
    totalAmounts[1].textContent = "$0.00";
  } else {
    totalAmounts[0].textContent = formatCurrency(totalTip);
    totalAmounts[1].textContent = formatCurrency(totalPerPerson);
  }
}

function formatCurrency(currencyAmount) {
  let options = {
    style: "currency",
    currency: "USD",
  };
  return new Intl.NumberFormat("en-US", options).format(currencyAmount);
}

function resetFieldValues() {
  bill.value = "";
  // remove active states from tipBtns
  deactivateTipOption();
  customTip.value = "";
  numOfPeople.value = "";
  totalAmounts.forEach((totalAmount) => {
    totalAmount.textContent = "$0.00";
  });
}

function checkForZeroError() {
  // query the form field element
  let parentElement = numOfPeople.parentElement.parentElement;
  if (parseFloat(numOfPeople.value) === 0 || numOfPeople.value === "") {
    parentElement.classList.add("error");
  } else {
    parentElement.classList.remove("error");
  }
}

function handleNegativeValues() {
  // reset fields if user enters negative values
  if (this.value < 0) {
    this.value = "";
  }
}

tipBtns.forEach((tipBtn) => {
  tipBtn.addEventListener("click", handleFieldValues);
});
customTip.addEventListener("input", handleFieldValues);
customTip.addEventListener("input", handleNegativeValues);

bill.addEventListener("input", handleFieldValues);
bill.addEventListener("input", handleNegativeValues);

numOfPeople.addEventListener("input", handleFieldValues);
numOfPeople.addEventListener("input", handleNegativeValues);

reset.addEventListener("click", resetFieldValues);
