document.addEventListener("DOMContentLoaded", function () {
    const expensesSection = document.getElementById("expenses-section");
    const addCategoryBtn = document.getElementById("add-category-btn");
    const calculateBtn = document.getElementById("calculate-btn");
    const resultsSection = document.getElementById("results-section");
    const errorMessage = document.getElementById("error-message");

    addCategoryBtn.addEventListener("click", addCategory);
    expensesSection.addEventListener("input", updateCalculateButton);
    calculateBtn.addEventListener("click", calculateBudget);

    function addCategory() {
        const newCategory = document.createElement("div");
        newCategory.classList.add("category");
        newCategory.innerHTML = `
            <label for="category">Category</label>
            <input type="text" class="category-name" placeholder="Category name">
            <div class="expense-items">
                <div class="expense-item">
                    <input type="text" class="item-name" placeholder="Expense name">
                    <input type="number" class="item-amount" placeholder="Expense amount">
                </div>
                <div class="expense-item">
                    <input type="text" class="item-name" placeholder="Expense name">
                    <input type="number" class="item-amount" placeholder="Expense amount">
                </div>
                <div class="expense-item">
                    <input type="text" class="item-name" placeholder="Expense name">
                    <input type="number" class="item-amount" placeholder="Expense amount">
                </div>
            </div>
            <button class="add-item-btn">+</button>
        `;

        expensesSection.appendChild(newCategory);
        updateCalculateButton();
    }

    function updateCalculateButton() {
        const categories = expensesSection.querySelectorAll(".category");
        let validCategoriesCount = 0;

        categories.forEach(category => {
            const categoryName = category.querySelector(".category-name").value.trim();
            const items = category.querySelectorAll(".expense-item");
            let validItemsCount = 0;

            items.forEach(item => {
                const itemName = item.querySelector(".item-name").value.trim();
                const itemAmount = item.querySelector(".item-amount").value.trim();

                if (itemName !== "" && itemAmount !== "") {
                    validItemsCount++;
                }
            });

            if (categoryName !== "" && validItemsCount >= 3) {
                validCategoriesCount++;
            }
        });

        if (validCategoriesCount >= 3) {
            calculateBtn.removeAttribute("disabled");
            errorMessage.textContent = "";
        } else {
            calculateBtn.setAttribute("disabled", "true");
            if (validCategoriesCount < 3) {
                errorMessage.textContent = "At least 3 categories are required, each with 3 items.";
            }
        }
    }

    function calculateBudget() {
        const startingAmount = parseFloat(document.getElementById("starting-amount").value);
        const categories = expensesSection.querySelectorAll(".category");

        if (categories.length < 3) {
            alert("Please add at least 3 categories.");
            return;
        }

        let totalExpenses = 0;
        let expenseCount = 0;
        let itemsError = false;

        resultsSection.innerHTML = "";

        categories.forEach(category => {
            const categoryName = category.querySelector(".category-name").value;
            const items = category.querySelectorAll(".expense-item");

            if (items.length < 3) {
                itemsError = true;
                return;
            }

            let categoryTotal = 0;

            resultsSection.insertAdjacentHTML("beforeend", `
                <h2>${categoryName}</h2>
            `);

            items.forEach(item => {
                const expenseName = item.querySelector(".item-name").value;
                const expenseAmount = parseFloat(item.querySelector(".item-amount").value);

                resultsSection.insertAdjacentHTML("beforeend", `
                    <p>${expenseName}: $${expenseAmount.toFixed(2)}</p>
                `);

                categoryTotal += expenseAmount;
                totalExpenses += expenseAmount;
                expenseCount++;
            });

            resultsSection.insertAdjacentHTML("beforeend", `
                <p><strong>Net ${categoryName} expenses: $${categoryTotal.toFixed(2)}</strong></p>
            `);
        });

        if (itemsError) {
            alert("Each category must have at least 3 items.");
            return;
        }

        const netResult = startingAmount - totalExpenses;
        const averageCost = totalExpenses / expenseCount;

        resultsSection.insertAdjacentHTML("beforeend", `
            <h2>Total Expenses</h2>
            <p>Net result: ${netResult >= 0 ? "Positive" : "Negative"} $${Math.abs(netResult).toFixed(2)}</p>
            <p>Total expenses for all categories: $${totalExpenses.toFixed(2)}</p>
            <p>Average cost per item: $${averageCost.toFixed(2)}</p>
            ${netResult >= 0 ? '<img src="positive_image.png" alt="Positive Image">' : '<img src="negative_image.png" alt="Negative Image">'}
        `);
    }

    expensesSection.addEventListener("click", function (event) {
        if (event.target && event.target.classList.contains("add-item-btn")) {
            const category = event.target.closest(".category");
            const expenseItems = category.querySelector(".expense-items");

            const newItem = document.createElement("div");
            newItem.classList.add("expense-item");
            newItem.innerHTML = `
                <input type="text" class="item-name" placeholder="Expense name">
                <input type="number" class="item-amount" placeholder="Expense amount">
            `;

            expenseItems.appendChild(newItem);
            updateCalculateButton();
        }
    });
});