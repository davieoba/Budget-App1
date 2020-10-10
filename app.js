const budgetController = (function () {
  const Income = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  const Expense = function (id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  };

  const data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  function calc(type) {
    let sum = 0;
    data.allItems[type].forEach((el) => {
      sum += el.value;
    });
    // console.log(sum)
    data.totals[type] = sum;
  }

  return {
    addItems: function (obj) {
      let newItems, ID;
      // console.log(obj.type);
      if (data.allItems[obj.type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[obj.type][data.allItems[obj.type].length - 1].id + 1;
      }

      if (obj.type === "inc") {
        newItems = new Income(ID, obj.descr, obj.value);
      } else if (obj.type === "exp") {
        newItems = new Expense(ID, obj.descr, obj.value);
      }

      data.allItems[obj.type].push(newItems);

      return newItems;
    },
    testing: function () {
      console.log(data);
    },
    calcBudget: function () {
      calc("inc");
      calc("exp");
      data.budget = data.totals.inc - data.totals.exp;
      console.log(data.budget);
    },
    getBudget: function () {
      return {
        income: data.totals.inc,
        expense: data.totals.exp,
        budget: data.budget,
      };
    },
    deleteListItem: function (type, id) {
      // console.log(id);
      // const ids = data.allItems[type].map((el) => {
      //   return el.id;
      // });
      // console.log(ids);
      // const userid = id;
      // const index = data.allItems[type].id.indexOf(ids);
      // console.log(index);

      data.allItems[type].forEach((el, index) => {
        if (el.id === id) {
          data.allItems[type].splice(index, 1);
        }
      });
    },
  };
})();

const UIController = (function () {
  return {
    getInput: function () {
      return {
        type: document.querySelector(".add__type").value,
        descr: document.querySelector(".add__description").value,
        value: parseInt(document.querySelector(".add__value").value),
      };
    },
    addListItems: function (type, obj) {
      // console.log(obj);
      let html, newHTML;
      if (type === "inc") {
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%descr%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-trash"></i></button></div></div></div>`;
      } else if (type === "exp") {
        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%descr%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-trash"></i></button></div></div></div>`;
      }
      newHTML = html.replace("%id%", obj.id);
      // console.log((newHTML += newHTML.replace("%descr%", obj.desc)));
      // console.log((newHTML += newHTML.replace("%value%", obj.value)));
      newHTML = newHTML.replace("%descr%", obj.desc);
      newHTML = newHTML.replace("%value%", obj.value);
      // console.log((newHTML += newHTML.replace("%value%", obj.value)));
      // newHTML = newHTML + newHTML.replace('%id%', obj.id);

      if (type === "inc") {
        document
          .querySelector(".income__list")
          .insertAdjacentHTML("beforeend", newHTML);
      } else if (type === "exp") {
        document
          .querySelector(".expenses__list")
          .insertAdjacentHTML("beforeend", newHTML);
      }
    },
    displayBudget: function (obj) {
      document.querySelector(
        ".budget__income--value"
      ).textContent = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(obj.income);

      document.querySelector(
        ".budget__expenses--value"
      ).textContent = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(obj.expense);

      document.querySelector(
        ".budget__value"
      ).textContent = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(obj.budget);
    },
    deleteItem: function (item) {
      // console.log(item.parentNode);
      // console.log(document.getElementById(item));
      // const el = document.getElementById(item);
      document.getElementById(item).remove();
    },
    displayMonth: function () {
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let selectedMonth = months[new Date().getMonth()];
      document.querySelector(".budget__title--month").textContent =
        selectedMonth + " " + new Date().getFullYear();
    },
    clearFields: function () {
      let fields, field1, field2;
      (fields = []), (field1 = document.querySelector(".add__description"));
      field2 = document.querySelector(".add__value");
      fields.push(field1, field2);
      fields.forEach((el) => {
        el.value = "";
      });
      field1.focus();
    },
  };
})();

const appController = (function (budgetCtrl, UICtrl) {
  const setupEventListener = function () {
    // if the user click on the enter button
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);
    // if the user clicks on the enter key
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        ctrlAddItem();
      }
    });

    document
      .querySelector(".container")
      .addEventListener("click", ctrlDeleteItem);
    UICtrl.displayMonth();
  };

  const updateBudget = function () {
    budgetCtrl.calcBudget();
    // update the ui with the budget
    const budget = budgetCtrl.getBudget();
    UICtrl.displayBudget(budget);
  };

  const ctrlAddItem = function () {
    //get the input values
    const input = UICtrl.getInput();
    // console.log(input);

    if (input.descr !== "" && input.value > 0 && isNaN(input.descr)) {
      const addItems = budgetCtrl.addItems(input);
      // console.log(addItems);
      const display = UICtrl.addListItems(input.type, addItems);
      UICtrl.clearFields();
      // calculate the budget
      updateBudget();
    }
  };

  ctrlDeleteItem = function (e) {
    // console.log(e.target.parentNode.parentNode.parentNode.parentNode.id);
    let itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      const splitID = itemID.split("-");
      const type = splitID[0];
      const id = parseInt(splitID[1]);
      console.log(type, id);
      budgetCtrl.deleteListItem(type, id);
      UICtrl.deleteItem(itemID);
      updateBudget();
    }
  };
  return {
    init: function () {
      setupEventListener();
      document.querySelector(".budget__income--value").textContent = "0";
      document.querySelector(".budget__expenses--value").textContent = "0";
      document.querySelector(".budget__value").textContent = "0";
    },
  };
})(budgetController, UIController);

appController.init();
