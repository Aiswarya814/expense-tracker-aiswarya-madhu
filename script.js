
/* =========================================
   FINORA EXPENSE TRACKER
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const transactionForm =
    document.getElementById("transactionForm");

const typeInput =
    document.getElementById("type");

const expenseTypeButton =
    document.getElementById("expenseTypeButton");

const incomeTypeButton =
    document.getElementById("incomeTypeButton");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");


const totalIncomeElement =
    document.getElementById("totalIncome");

const totalExpenseElement =
    document.getElementById("totalExpense");

const balanceElement =
    document.getElementById("balance");

const bannerBalance =
    document.getElementById("bannerBalance");


const transactionList =
    document.getElementById("transactionList");

const transactionCount =
    document.getElementById("transactionCount");

const emptyState =
    document.getElementById("emptyState");


const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const searchInput =
    document.getElementById("searchInput");


const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const clearAllButton =
    document.getElementById("clearAllButton");

const formTitle =
    document.getElementById("formTitle");


/* Monthly */

const monthFilter =
    document.getElementById("monthFilter");

const monthlyIncome =
    document.getElementById("monthlyIncome");

const monthlyExpense =
    document.getElementById("monthlyExpense");

const monthlyBalance =
    document.getElementById("monthlyBalance");

const expenseRatio =
    document.getElementById("expenseRatio");

const progressFill =
    document.getElementById("progressFill");


/* Chart */

const categoryChart =
    document.getElementById("categoryChart");

const chartEmpty =
    document.getElementById("chartEmpty");


/* Date */

const todayDate =
    document.getElementById("todayDate");


/* =========================================
   VARIABLES
========================================= */

let transactions = [];

let editingId = null;


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTodayDate();

        setDefaultDate();

        setDefaultMonth();

        loadTransactions();

        setupTypeButtons();

    }
);


/* =========================================
   TODAY DATE
========================================= */

function setTodayDate() {

    const today = new Date();


    todayDate.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


/* =========================================
   DEFAULT DATE
========================================= */

function setDefaultDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;

}


/* =========================================
   DEFAULT MONTH
========================================= */

function setDefaultMonth() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    monthFilter.value =
        `${year}-${month}`;

}


/* =========================================
   TYPE BUTTONS
========================================= */

function setupTypeButtons() {

    expenseTypeButton.addEventListener(
        "click",
        () => {

            setTransactionType("expense");

        }
    );


    incomeTypeButton.addEventListener(
        "click",
        () => {

            setTransactionType("income");

        }
    );

}


function setTransactionType(type) {

    typeInput.value = type;


    expenseTypeButton.classList.toggle(
        "active",
        type === "expense"
    );


    incomeTypeButton.classList.toggle(
        "active",
        type === "income"
    );

}


/* =========================================
   LOCAL STORAGE
========================================= */

function saveTransactions() {

    localStorage.setItem(
        "finoraTransactions",
        JSON.stringify(transactions)
    );

}


function loadTransactions() {

    const saved =
        localStorage.getItem(
            "finoraTransactions"
        );


    if (saved) {

        try {

            transactions =
                JSON.parse(saved);

        }

        catch (error) {

            console.error(
                "Unable to load transactions",
                error
            );

            transactions = [];

        }

    }


    renderTransactions();

    updateSummary();

    updateMonthlySummary();

    updateCategoryChart();

}


/* =========================================
   VALIDATION
========================================= */

function clearErrors() {

    const errorElements =
        document.querySelectorAll(
            ".error-message"
        );


    errorElements.forEach(
        element => {

            element.textContent = "";

        }
    );


    const fields = [
        amountInput,
        categoryInput,
        dateInput,
        descriptionInput
    ];


    fields.forEach(
        field => {

            field.classList.remove(
                "input-error"
            );

        }
    );

}


function showError(
    input,
    errorId,
    message
) {

    input.classList.add(
        "input-error"
    );


    document
        .getElementById(errorId)
        .textContent = message;

}


function validateForm() {

    clearErrors();


    let valid = true;


    const amount =
        parseFloat(
            amountInput.value
        );


    /* Amount */

    if (
        amountInput.value.trim() === ""
    ) {

        showError(
            amountInput,
            "amountError",
            "Please enter an amount."
        );

        valid = false;

    }

    else if (
        isNaN(amount) ||
        amount <= 0
    ) {

        showError(
            amountInput,
            "amountError",
            "Amount must be greater than ₹0."
        );

        valid = false;

    }

    else if (
        amount > 100000000
    ) {

        showError(
            amountInput,
            "amountError",
            "Please enter a valid amount."
        );

        valid = false;

    }


    /* Category */

    if (
        categoryInput.value === ""
    ) {

        showError(
            categoryInput,
            "categoryError",
            "Please select a category."
        );

        valid = false;

    }


    /* Date */

    if (
        dateInput.value === ""
    ) {

        showError(
            dateInput,
            "dateError",
            "Please select a date."
        );

        valid = false;

    }


    /* Description */

    if (
        descriptionInput.value.length > 150
    ) {

        showError(
            descriptionInput,
            "descriptionError",
            "Maximum 150 characters allowed."
        );

        valid = false;

    }


    return valid;

}


/* =========================================
   FORM SUBMIT
========================================= */

transactionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        const transactionData = {

            type: typeInput.value,

            amount:
                parseFloat(
                    amountInput.value
                ),

            category:
                categoryInput.value,

            date:
                dateInput.value,

            description:
                descriptionInput.value.trim()

        };


        /* EDIT */

        if (editingId !== null) {

            const index =
                transactions.findIndex(
                    transaction =>
                        transaction.id === editingId
                );


            if (index !== -1) {

                transactions[index] = {

                    ...transactions[index],

                    ...transactionData

                };

            }


            editingId = null;


            formTitle.textContent =
                "Add transaction";


            submitButton.innerHTML =
                "<span>+</span> Add transaction";


            cancelButton.classList.add(
                "hidden"
            );

        }


        /* ADD */

        else {

            transactions.push({

                id:
                    Date.now(),

                ...transactionData

            });

        }


        saveTransactions();


        resetForm();


        renderTransactions();

        updateSummary();

        updateMonthlySummary();

        updateCategoryChart();

    }
);


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    transactionForm.reset();

    clearErrors();

    setDefaultDate();

    setTransactionType("expense");

}


/* =========================================
   EDIT
========================================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {

        return;

    }


    setTransactionType(
        transaction.type
    );


    amountInput.value =
        transaction.amount;


    categoryInput.value =
        transaction.category;


    dateInput.value =
        transaction.date;


    descriptionInput.value =
        transaction.description;


    editingId = id;


    formTitle.textContent =
        "Edit transaction";


    submitButton.innerHTML =
        "<span>✓</span> Update transaction";


    cancelButton.classList.remove(
        "hidden"
    );


    document
        .querySelector(".form-panel")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


/* =========================================
   CANCEL EDIT
========================================= */

cancelButton.addEventListener(
    "click",
    () => {

        editingId = null;

        resetForm();

        formTitle.textContent =
            "Add transaction";

        submitButton.innerHTML =
            "<span>+</span> Add transaction";

        cancelButton.classList.add(
            "hidden"
        );

    }
);


/* =========================================
   DELETE
========================================= */

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {

        return;

    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();


    renderTransactions();

    updateSummary();

    updateMonthlySummary();

    updateCategoryChart();

}


/* =========================================
   CLEAR ALL
========================================= */

clearAllButton.addEventListener(
    "click",
    () => {

        if (
            transactions.length === 0
        ) {

            alert(
                "There are no transactions to clear."
            );

            return;

        }


        const confirmed =
            confirm(
                "This will permanently remove all transactions. Continue?"
            );


        if (!confirmed) {

            return;

        }


        transactions = [];


        saveTransactions();


        resetForm();


        editingId = null;


        formTitle.textContent =
            "Add transaction";


        submitButton.innerHTML =
            "<span>+</span> Add transaction";


        cancelButton.classList.add(
            "hidden"
        );


        renderTransactions();

        updateSummary();

        updateMonthlySummary();

        updateCategoryChart();

    }
);


/* =========================================
   FILTER EVENTS
========================================= */

typeFilter.addEventListener(
    "change",
    renderTransactions
);


categoryFilter.addEventListener(
    "change",
    renderTransactions
);


searchInput.addEventListener(
    "input",
    renderTransactions
);


monthFilter.addEventListener(
    "change",
    () => {

        updateMonthlySummary();

        updateCategoryChart();

    }
);


/* =========================================
   GET FILTERED TRANSACTIONS
========================================= */

function getFilteredTransactions() {

    const selectedType =
        typeFilter.value;


    const selectedCategory =
        categoryFilter.value;


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    return transactions.filter(
        transaction => {

            if (
                selectedType !== "all" &&
                transaction.type !== selectedType
            ) {

                return false;

            }


            if (
                selectedCategory !== "all" &&
                transaction.category !==
                    selectedCategory
            ) {

                return false;

            }


            if (search !== "") {

                const searchable =
                    `
                    ${transaction.category}
                    ${transaction.description}
                    ${transaction.amount}
                    ${transaction.date}
                    `.toLowerCase();


                if (
                    !searchable.includes(search)
                ) {

                    return false;

                }

            }


            return true;

        }
    );

}


/* =========================================
   RENDER TRANSACTIONS
========================================= */

function renderTransactions() {

    const filtered =
        getFilteredTransactions();


    transactionList.innerHTML = "";


    transactionCount.textContent =
        `${filtered.length} ${
            filtered.length === 1
                ? "transaction"
                : "transactions"
        }`;


    if (
        filtered.length === 0
    ) {

        emptyState.style.display =
            "block";

    }

    else {

        emptyState.style.display =
            "none";

    }


    const sorted =
        [...filtered].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    sorted.forEach(
        transaction => {

            transactionList.appendChild(
                createTransactionElement(
                    transaction
                )
            );

        }
    );

}


/* =========================================
   CREATE TRANSACTION
========================================= */

function createTransactionElement(
    transaction
) {

    const element =
        document.createElement("div");


    element.className =
        "transaction-item";


    const isIncome =
        transaction.type === "income";


    const sign =
        isIncome ? "+" : "-";


    const icon =
        isIncome ? "↗" : "↘";


    const amount =
        formatCurrency(
            transaction.amount
        );


    element.innerHTML = `

        <div class="transaction-info">

            <div class="transaction-icon ${transaction.type}">
                ${icon}
            </div>


            <div class="transaction-details">

                <h4>
                    ${
                        escapeHTML(
                            transaction.description ||
                            transaction.category
                        )
                    }
                </h4>


                <div class="transaction-meta">

                    <span class="transaction-date">
                        ${formatDate(transaction.date)}
                    </span>

                    <span class="category-badge">
                        ${escapeHTML(transaction.category)}
                    </span>

                </div>

            </div>

        </div>


        <div class="transaction-right">

            <span class="transaction-amount ${transaction.type}">
                ${sign}${amount}
            </span>


            <div class="transaction-actions">

                <button
                    class="action-btn edit-btn"
                    onclick="editTransaction(${transaction.id})"
                    title="Edit"
                >
                    ✎
                </button>


                <button
                    class="action-btn delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete"
                >
                    ×
                </button>

            </div>

        </div>

    `;


    return element;

}


/* =========================================
   MAIN SUMMARY
========================================= */

function updateSummary() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type === "income"
            ) {

                income +=
                    Number(
                        transaction.amount
                    );

            }

            else {

                expense +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    const balance =
        income - expense;


    totalIncomeElement.textContent =
        formatCurrency(income);


    totalExpenseElement.textContent =
        formatCurrency(expense);


    balanceElement.textContent =
        formatCurrency(balance);


    bannerBalance.textContent =
        formatCurrency(balance);


    if (balance < 0) {

        balanceElement.style.color =
            "#dc2626";

        bannerBalance.style.color =
            "#fecaca";

    }

    else {

        balanceElement.style.color =
            "#2563eb";

        bannerBalance.style.color =
            "white";

    }

}


/* =========================================
   MONTHLY SUMMARY
========================================= */

function updateMonthlySummary() {

    const selectedMonth =
        monthFilter.value;


    if (!selectedMonth) {

        return;

    }


    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (
                !transaction.date.startsWith(
                    selectedMonth
                )
            ) {

                return;

            }


            if (
                transaction.type === "income"
            ) {

                income +=
                    Number(
                        transaction.amount
                    );

            }

            else {

                expense +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    const balance =
        income - expense;


    monthlyIncome.textContent =
        formatCurrency(income);


    monthlyExpense.textContent =
        formatCurrency(expense);


    monthlyBalance.textContent =
        formatCurrency(balance);


    /* Expense ratio */

    let ratio = 0;


    if (income > 0) {

        ratio =
            (expense / income) * 100;

    }


    /*
        Do not allow the visual bar
        to exceed 100%.
    */

    const visualRatio =
        Math.min(
            ratio,
            100
        );


    expenseRatio.textContent =
        `${ratio.toFixed(1)}%`;


    progressFill.style.width =
        `${visualRatio}%`;


    if (balance < 0) {

        monthlyBalance.style.color =
            "#dc2626";

    }

    else {

        monthlyBalance.style.color =
            "#2563eb";

    }

}


/* =========================================
   CATEGORY CHART
========================================= */

function updateCategoryChart() {

    categoryChart.innerHTML = "";


    const selectedMonth =
        monthFilter.value;


    if (!selectedMonth) {

        chartEmpty.style.display =
            "block";

        return;

    }


    const categoryTotals = {};


    transactions.forEach(
        transaction => {

            if (
                transaction.type !==
                "expense"
            ) {

                return;

            }


            if (
                !transaction.date.startsWith(
                    selectedMonth
                )
            ) {

                return;

            }


            const category =
                transaction.category;


            if (
                !categoryTotals[category]
            ) {

                categoryTotals[category] =
                    0;

            }


            categoryTotals[category] +=
                Number(
                    transaction.amount
                );

        }
    );


    const categories =
        Object.entries(
            categoryTotals
        );


    if (
        categories.length === 0
    ) {

        chartEmpty.style.display =
            "block";

        categoryChart.style.display =
            "none";

        return;

    }


    chartEmpty.style.display =
        "none";


    categoryChart.style.display =
        "flex";


    categories.sort(
        (a, b) =>
            b[1] - a[1]
    );


    const max =
        Math.max(
            ...categories.map(
                item => item[1]
            )
        );


    categories.forEach(
        ([category, amount]) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "chart-row";


            const width =
                max > 0
                    ? (amount / max) * 100
                    : 0;


            row.innerHTML = `

                <div class="chart-category">
                    ${escapeHTML(category)}
                </div>


                <div class="chart-bar-container">

                    <div
                        class="chart-bar"
                        style="width: ${width}%"
                    ></div>

                </div>


                <div class="chart-value">
                    ${formatCurrency(amount)}
                </div>

            `;


            categoryChart.appendChild(
                row
            );

        }
    );

}


/* =========================================
   CURRENCY
========================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",

            currency: "INR",

            minimumFractionDigits: 2
        }
    ).format(amount);

}


/* =========================================
   DATE
========================================= */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric"
        }
    );

}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}

