/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
      // purchase — это одна из записей в поле items из чека в data.purchase_records
   // _product — это продукт из коллекции data.products
   const { discount, sale_price, quantity } = purchase;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    if (!data
        || [data.sellers, data.products, data.purchase_records].every(item => !Array.isArray(item))
        || [data.sellers.length, data.products.length, data.purchase_records.length].every(
            item => item === 0
        )
    ) { 
        throw new Error('Не корректные входные данные');
    }

    // @TODO: Проверка наличия опций
    const { calculateRevenue, calculateBonus } = options;

    // Проверяем, что обе функции присутствуют
    if (!calculateRevenue || !calculateBonus) {
        throw new Error(
            `Не хватает переменной ${!calculateRevenue ? 'calculateRevenue' : 'calculateBonus'}`
        );
    } 

    // Проверяем, что обе переменные - функции
    if (typeof calculateRevenue !== "function" || typeof calculateBonus !== "function") {
        throw new Error('Переменная не является функцией')
    }

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
