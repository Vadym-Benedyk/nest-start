Init study project on Nest.js

1.(06/01/2025) Create project on Nest.js
User daemon
db

2.(06/01/2025) Migrations and models for db. Using sequelize

3.(09/01/2025) Завдання: Реалізувати функціонал списку з використанням Sequelize
Опис:
Необхідно створити ендпоінт для отримання списку користувачів з підтримкою пагінації, сортування та пошуку.

3. (08/01/2025)
    TODO:
        - Fix bug with init page loading. On init route '/' 404

{
"page": 0,
"limit": 10,  — максимальна кількість записів, які будуть повернуті на одній сторінці. Це забезпечує пагінацію
"search": "string", // необов’язкове
"orderBy": {
"direction": "asc", // або "desc"
"field": "string" // поле для сортування
},
"options": { // необов’язкові фільтри
"firstName": "string",
"lastName": "string",
"email": "string",
"role": "string"
}
}
Відповідь має бути у форматі:


{
"data": [
{
"id": "string",
"firstName": "string",
"lastName": "string",
"email": "string",
"role": "string"
}
],
"meta": {
"totalCount": 1, // кількість записів, що відповідають запиту
"count": 1, // кількість записів у відповіді
"page": 0,
"limit": 10,
"offset": 0, // offset = page * limit  — кількість записів, яку потрібно пропустити.
"search": "Example" // якщо був використаний пошук
}
}
Примітки:
Пагінація: offset = page * limit.
totalCount: має відображати всі записи, що відповідають запиту, без урахування limit і offset.
Сортування: підтримка полів у параметрі orderBy.
Фільтрація: враховувати поля з options.