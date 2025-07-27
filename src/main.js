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
   const discountFactor = 1 - (discount / 100);
   return sale_price * quantity * discountFactor;
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
    if (index === 0) {
        return profit * 0.15;
    } else if (index === 1 || index === 2) {
        return profit * 0.1;
    } else if (index === total - 1) {
        return 0;
    } else {
        return profit * 0.05;
    }
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
        || data.purchase_records.length === 0
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
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }));

    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(seller => [seller.id, seller]));
    const productIndex = Object.fromEntries(data.products.map(item => [item.sku, item]));

    // @TODO: Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id]
        // Увеличить количество продаж
        seller.sales_count += 1;
        // Увеличить общую сумму всех продаж
        seller.revenue += record.total_amount;

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            // Товар
            const product = productIndex[item.sku];

            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            const cost = product.purchase_price * item.quantity;

            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            const revenue = calculateRevenue(item, product);

            // Посчитать прибыль: выручка минус себестоимость
            const profit = revenue - cost;

            // Увеличить общую накопленную прибыль (profit) у продавца  
            seller.profit += profit;

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }

            // По артикулу товара увеличить его проданное количество у продавца
            seller.products_sold[item.sku] += item.quantity

        });
    });

    // @TODO: Сортировка продавцов по прибыли
    sellerStats.sort((a, b) => b.profit - a.profit);

    // @TODO: Назначение премий на основе ранжирования
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller)
        seller.top_products = Object.entries(seller.products_sold)
            .map(([sku, quantity]) => ({ sku, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    });
    // @TODO: Подготовка итоговой коллекции с нужными полями
      return sellerStats.map((seller) => ({
        seller_id: seller.id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2), // число с 2 знаками после точки
        profit: +seller.profit.toFixed(2), // число с 2 знаками после точки
        sales_count: seller.sales_count, // целое число
        top_products: seller.top_products, // массив из топ-10 товаров
        bonus: +seller.bonus.toFixed(2), // число с 2 знаками после точки
    }));
}
